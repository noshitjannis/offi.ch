<script>
    // WICHTIG: html2pdf nur im Browser laden
    import { onMount, tick } from "svelte";

    /** @type {any} */
    let html2pdf;
    let isExporting = false;
    /** @type {HTMLDivElement | null} */
    let pdfPreviewEl = null;
    let previewScale = 1;
    let appliedPreviewScale = 1;
    /** @type {ResizeObserver | null} */
    let resizeObserver = null;
    /** @type {HTMLDivElement | null} */
    let companySectionEl = null;
    /** @type {HTMLDivElement | null} */
    let customerSectionEl = null;
    /** @type {HTMLDivElement | null} */
    let offerSectionEl = null;
    /** @type {HTMLDivElement | null} */
    let contactSectionEl = null;
    /** @type {HTMLDivElement | null} */
    let positionsSectionEl = null;

    function recalcPreviewScale() {
        if (!pdfPreviewEl) {
            previewScale = 1;
            return;
        }

        const page =
            /** @type {HTMLElement | null} */ (
                pdfPreviewEl.querySelector(".pdf-page")
            );
        if (!page) {
            previewScale = 1;
            return;
        }

        const availableWidth = pdfPreviewEl.clientWidth;
        const naturalWidth = page.offsetWidth;
        if (!availableWidth || !naturalWidth) {
            previewScale = 1;
            return;
        }

        const nextScale = Math.min(1, availableWidth / naturalWidth);
        if (Math.abs(nextScale - previewScale) > 0.001) {
            previewScale = nextScale;
        }
    }

    onMount(() => {
        let cancelled = false;

        (async () => {
            const mod = await import("html2pdf.js");
            if (!cancelled) {
                html2pdf = mod.default || mod;
            }
        })();

        const handleResize = () => {
            recalcPreviewScale();
        };

        window.addEventListener("resize", handleResize);

        if (typeof ResizeObserver !== "undefined") {
            resizeObserver = new ResizeObserver(handleResize);
            if (pdfPreviewEl) {
                resizeObserver.observe(pdfPreviewEl);
            }
        }

        recalcPreviewScale();

        return () => {
            cancelled = true;
            window.removeEventListener("resize", handleResize);
            resizeObserver?.disconnect();
        };
    });

    onMount(() => {
        if (typeof localStorage === "undefined") return;
        const stored = localStorage.getItem(TEMPLATE_STORAGE_KEY);
        if (!stored) return;

        try {
            const template = JSON.parse(stored);
            applyTemplateData(template);
        } catch (error) {
            console.error("Vorlage konnte nicht geladen werden", error);
        } finally {
            localStorage.removeItem(TEMPLATE_STORAGE_KEY);
        }
    });

    const PLACEHOLDERS = {
        companyName: "Offi.ch",
        companyAddress: "Offertenstrasse 1\n8000 Offer",
        companyEmail: "info@offi.ch",
        companyPhone: "+41 44 123 45 67",
        companyWebsite: "www.offi.ch",
        companyVatNumber: "CHE-123.456.789 MWST",
        bankName: "Musterbank",
        bankLocation: "CH-3030 Musterstadt",
        bankAccount: "1111-1111.222",
        bankIban: "CH99 0000 0000 0000 0000 9",
        bankSwift: "ABCDEFGH12J",
        customerName: "Kurt Musterkunde",
        customerStreet: "Kundenstrasse 1",
        customerZipCity: "CH-6396 Kundenwil",
        offerNumber: "1234",
        offerSubject: "Gegenstand der Offerte spezifizieren",
        offerDate: new Date().toISOString().slice(0, 10),
        requestDate: new Date().toISOString().slice(0, 10),
        offerValidityDays: 30,
        deliveryText: "nach Vereinbarung",
        contactPerson: "Tino Offer",
        contactEmail: "tino@offi.ch",
        contactPhone: "+41 44 765 43 21",
        vatRate: 8.1,
        discountPercent: 0,
        discountLabel: "Rabatt",
    };

    const POSITION_PLACEHOLDERS = [
        {
            articleNumber: "01",
            description: "Positionsbeschreibung 1",
            quantity: 1,
            unitPrice: 450,
        },
        {
            articleNumber: "02",
            description: "Positionsbeschreibung 2",
            quantity: 1,
            unitPrice: 180,
        },
    ];

    // Firmendaten
    let companyName = "";
    let companyAddress = "";
    let companyEmail = "";
    let companyPhone = "";
    let companyWebsite = "";
    let companyVatNumber = "";

    // Firmenlogo
    let companyLogo = "";
    let logoError = "";
    let isLogoDragActive = false;
    /** @type {HTMLInputElement | null} */
    let logoFileInput = null;

    // Bankverbindung
    let bankName = "";
    let bankLocation = "";
    let bankAccount = "";
    let bankIban = "";
    let bankSwift = "";

    // Kundendaten
    let customerName = "";
    let customerStreet = "";
    let customerZipCity = "";

    // Offerten-Metadaten
    let offerNumber = "";
    let offerSubject = "";
    let offerDate = ""; // Offertdatum
    let requestDate = ""; // Datum der Anfrage
    /** @type {string | number} */
    let offerValidityDays = "";
    let deliveryText = "";

    // Ansprechpartner
    let contactPerson = "";
    let contactEmail = "";
    let contactPhone = "";

    // Steuer / Rabatt
    let vatRate = PLACEHOLDERS.vatRate;
    /** @type {string | number} */
    let discountPercent = "";
    let discountLabel = "";

    const FIRST_PAGE_POSITION_ROWS = 10;
    const FOLLOWUP_PAGE_POSITION_ROWS = 18;
    const TEMPLATE_STORAGE_KEY = "offertio-template";

    // Positionen mit Artikelnummer
    /** @type {{articleNumber: string; description: string; quantity: string | number; unitPrice: string | number;}[]} */
    let positions = POSITION_PLACEHOLDERS.map(() => ({
        articleNumber: "",
        description: "",
        quantity: "",
        unitPrice: "",
    }));

    /**
     * @typedef {"company" | "customer" | "offer" | "contact" | "positions"} AccordionSection
     */

    /**
     * @returns {Record<AccordionSection, string[]>}
     */
    function createErrorState() {
        return {
            company: [],
            customer: [],
            offer: [],
            contact: [],
            positions: [],
        };
    }

    const accordionSequence =
        /** @type {AccordionSection[]} */ ([
            "company",
            "customer",
            "offer",
            "contact",
            "positions",
        ]);

    /**
     * @param {AccordionSection | null} activeSection
     * @returns {Record<AccordionSection, boolean>}
     */
    function createAccordionState(activeSection) {
        return {
            company: activeSection === "company",
            customer: activeSection === "customer",
            offer: activeSection === "offer",
            contact: activeSection === "contact",
            positions: activeSection === "positions",
        };
    }

    /** @type {Record<AccordionSection, boolean>} */
    let accordionState = createAccordionState("company");
    let showDownloads = false;
    /** @type {Record<AccordionSection, string[]>} */
    let sectionErrors = createErrorState();

    function getSectionElement(/** @type {AccordionSection} */ section) {
        switch (section) {
            case "company":
                return companySectionEl;
            case "customer":
                return customerSectionEl;
            case "offer":
                return offerSectionEl;
            case "contact":
                return contactSectionEl;
            case "positions":
                return positionsSectionEl;
        }
    }

    function openSection(/** @type {AccordionSection} */ section) {
        accordionState = createAccordionState(section);
        showDownloads = false;
        queueSectionScroll(section);
    }

    async function queueSectionScroll(/** @type {AccordionSection} */ section) {
        if (typeof window === "undefined") return;
        await tick();
        const target = getSectionElement(section);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    /**
     * @param {AccordionSection} section
     */
    function validateSection(section) {
        let errors = [];

        if (section === "company") {
            if (isBlank(companyName)) errors.push("Bitte Firmenname ausfüllen.");
            if (isBlank(companyAddress)) errors.push("Bitte Adresse ausfüllen.");
            if (isBlank(companyEmail)) errors.push("Bitte E-Mail ausfüllen.");
            if (isBlank(companyPhone)) errors.push("Bitte Telefon ausfüllen.");
            if (isBlank(companyWebsite)) errors.push("Bitte Website ausfüllen.");
            if (isBlank(companyVatNumber))
                errors.push("Bitte MWST-Nummer ausfüllen.");
            if (isBlank(bankName)) errors.push("Bitte Bankname ausfüllen.");
            if (isBlank(bankLocation)) errors.push("Bitte Bank-Ort ausfüllen.");
            if (isBlank(bankAccount)) errors.push("Bitte Konto ausfüllen.");
            if (isBlank(bankIban)) errors.push("Bitte IBAN ausfüllen.");
            if (isBlank(bankSwift)) errors.push("Bitte SWIFT-Code ausfüllen.");
        }

        if (section === "customer") {
            if (isBlank(customerName)) errors.push("Bitte Kundennamen ausfüllen.");
            if (isBlank(customerStreet)) errors.push("Bitte Strasse ausfüllen.");
            if (isBlank(customerZipCity)) errors.push("Bitte PLZ / Ort ausfüllen.");
        }

        if (section === "offer") {
            if (isBlank(offerNumber)) errors.push("Bitte Offerte-Nr. ausfüllen.");
            if (isBlank(offerSubject)) errors.push("Bitte Betreff ausfüllen.");
            if (isBlank(offerDate)) errors.push("Bitte Offertdatum ausfüllen.");
            if (isBlank(requestDate))
                errors.push("Bitte Datum der Anfrage ausfüllen.");

            const vat = Number(vatRate);
            const validity = Number(offerValidityDays);
            if (isBlank(vatRate) || !Number.isFinite(vat))
                errors.push("Bitte MWST in % angeben.");
            if (isBlank(offerValidityDays) || !Number.isFinite(validity) || validity <= 0)
                errors.push("Bitte Gueltigkeit in Tagen angeben.");
            if (isBlank(deliveryText)) errors.push("Bitte Lieferfrist ausfüllen.");
        }

        if (section === "contact") {
            if (isBlank(contactPerson)) errors.push("Bitte Ansprechpartner ausfüllen.");
            if (isBlank(contactEmail)) errors.push("Bitte E-Mail ausfüllen.");
            if (isBlank(contactPhone)) errors.push("Bitte Telefon ausfüllen.");
        }

        if (section === "positions") {
            const rowErrors = positions
                .map((pos, idx) => {
                    const missing =
                        isBlank(pos.articleNumber) ||
                        isBlank(pos.description) ||
                        isBlank(pos.quantity) ||
                        isBlank(pos.unitPrice) ||
                        !Number.isFinite(Number(pos.quantity)) ||
                        !Number.isFinite(Number(pos.unitPrice));
                    return missing ? idx + 1 : null;
                })
                .filter((n) => n !== null);

            if (!positions.length) {
                errors.push("Bitte mindestens eine Position erfassen.");
            } else if (rowErrors.length) {
                errors.push(
                    `Bitte alle Positionsfelder ausfüllen (Zeile ${rowErrors.join(", ")}).`,
                );
            }
        }

        sectionErrors = { ...sectionErrors, [section]: errors };
        return errors.length === 0;
    }

    function goToNext(/** @type {AccordionSection} */ section) {
        if (!validateSection(section)) {
            queueSectionScroll(section);
            return;
        }
        const currentIndex = accordionSequence.indexOf(section);
        const nextSection = accordionSequence[currentIndex + 1];
        if (nextSection) {
            openSection(nextSection);
        }
    }

    function goToPrevious(/** @type {AccordionSection} */ section) {
        const currentIndex = accordionSequence.indexOf(section);
        const previousSection = accordionSequence[currentIndex - 1];
        if (previousSection) {
            openSection(previousSection);
        }
    }

    function finishForm() {
        const lastSectionValid = validateSection("positions");
        if (lastSectionValid) {
            accordionState = createAccordionState(null);
            showDownloads = true;
        } else {
            queueSectionScroll("positions");
        }
    }

    function reopenPositions() {
        openSection("positions");
    }

    function addPosition() {
        positions = [
            ...positions,
            { articleNumber: "", description: "", quantity: "", unitPrice: "" },
        ];
    }

    function removePosition(/** @type {number} */ index) {
        positions = positions.filter((_, i) => i !== index);
    }

    // Berechnungen
    $: subtotal = resolvedPositions.reduce(
        (sum, p) => sum + Number(p.quantity || 0) * Number(p.unitPrice || 0),
        0,
    );

    $: discountAmount = subtotal * (resolvedDiscountPercent / 100);
    $: subtotalAfterDiscount = subtotal - discountAmount;

    $: vatAmount = subtotalAfterDiscount * (resolvedVatRate / 100);
    $: total = subtotalAfterDiscount + vatAmount;
    $: displayDiscountLabel =
        resolvedDiscountLabel && resolvedDiscountLabel.trim()
            ? `${resolvedDiscountLabel.trim()} (${resolvedDiscountPercent} %)`
            : `Rabatt ${resolvedDiscountPercent} %`;

    const allowedLogoTypes = ["image/png", "image/jpeg"];

    const isBlank = (/** @type {string | number | null | undefined} */ value) =>
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === "");

    /**
     * @template T
     * @param {T | string} value
     * @param {T} placeholder
     * @returns {T}
     */
    function textOrPlaceholder(value, placeholder) {
        if (typeof value === "string") {
            return /** @type {T} */ (value.trim() ? value : placeholder);
        }
        return value ?? placeholder;
    }

    /**
     * @param {string | number} value
     * @param {string | number} placeholder
     */
    function numberOrPlaceholder(value, placeholder) {
        const parsedValue = Number(value);
        if (value !== "" && Number.isFinite(parsedValue)) {
            return parsedValue;
        }
        const parsedPlaceholder = Number(placeholder);
        return Number.isFinite(parsedPlaceholder) ? parsedPlaceholder : 0;
    }

    /**
     * @param {number} index
     */
    function getPositionPlaceholder(index) {
        return (
            POSITION_PLACEHOLDERS[index] ?? {
                articleNumber: String(index + 1).padStart(2, "0"),
                description: "Positionsbeschreibung folgt",
                quantity: 1,
                unitPrice: 0,
            }
        );
    }

    $: resolvedCompanyName = textOrPlaceholder(
        companyName,
        PLACEHOLDERS.companyName,
    );
    $: resolvedCompanyAddress = textOrPlaceholder(
        companyAddress,
        PLACEHOLDERS.companyAddress,
    );
    $: resolvedCompanyEmail = textOrPlaceholder(
        companyEmail,
        PLACEHOLDERS.companyEmail,
    );
    $: resolvedCompanyPhone = textOrPlaceholder(
        companyPhone,
        PLACEHOLDERS.companyPhone,
    );
    $: resolvedCompanyWebsite = textOrPlaceholder(
        companyWebsite,
        PLACEHOLDERS.companyWebsite,
    );
    $: resolvedCompanyVatNumber = textOrPlaceholder(
        companyVatNumber,
        PLACEHOLDERS.companyVatNumber,
    );

    $: resolvedBankName = textOrPlaceholder(bankName, PLACEHOLDERS.bankName);
    $: resolvedBankLocation = textOrPlaceholder(
        bankLocation,
        PLACEHOLDERS.bankLocation,
    );
    $: resolvedBankAccount = textOrPlaceholder(
        bankAccount,
        PLACEHOLDERS.bankAccount,
    );
    $: resolvedBankIban = textOrPlaceholder(bankIban, PLACEHOLDERS.bankIban);
    $: resolvedBankSwift = textOrPlaceholder(bankSwift, PLACEHOLDERS.bankSwift);

    $: resolvedCustomerName = textOrPlaceholder(
        customerName,
        PLACEHOLDERS.customerName,
    );
    $: resolvedCustomerStreet = textOrPlaceholder(
        customerStreet,
        PLACEHOLDERS.customerStreet,
    );
    $: resolvedCustomerZipCity = textOrPlaceholder(
        customerZipCity,
        PLACEHOLDERS.customerZipCity,
    );

    $: resolvedOfferNumber = textOrPlaceholder(
        offerNumber,
        PLACEHOLDERS.offerNumber,
    );
    $: resolvedOfferSubject = textOrPlaceholder(
        offerSubject,
        PLACEHOLDERS.offerSubject,
    );
    $: resolvedOfferDate = textOrPlaceholder(offerDate, PLACEHOLDERS.offerDate);
    $: resolvedRequestDate = textOrPlaceholder(
        requestDate,
        PLACEHOLDERS.requestDate,
    );
    $: resolvedOfferValidityDays = numberOrPlaceholder(
        offerValidityDays,
        PLACEHOLDERS.offerValidityDays,
    );
    $: resolvedDeliveryText = textOrPlaceholder(
        deliveryText,
        PLACEHOLDERS.deliveryText,
    );

    $: resolvedContactPerson = textOrPlaceholder(
        contactPerson,
        PLACEHOLDERS.contactPerson,
    );
    $: resolvedContactEmail = textOrPlaceholder(
        contactEmail,
        PLACEHOLDERS.contactEmail,
    );
    $: resolvedContactPhone = textOrPlaceholder(
        contactPhone,
        PLACEHOLDERS.contactPhone,
    );

    $: resolvedVatRate = numberOrPlaceholder(vatRate, PLACEHOLDERS.vatRate);
    $: resolvedDiscountPercent = (() => {
        if (isBlank(discountPercent)) return 0;
        const parsed = Number(discountPercent);
        return Number.isFinite(parsed) ? parsed : 0;
    })();
    $: resolvedDiscountLabel = isBlank(discountLabel)
        ? ""
        : (typeof discountLabel === "string" ? discountLabel.trim() : discountLabel);

    $: resolvedPositions = positions.map((pos, index) => {
        const placeholder = getPositionPlaceholder(index);
        return {
            articleNumber: textOrPlaceholder(
                pos.articleNumber,
                placeholder.articleNumber,
            ),
            description: textOrPlaceholder(pos.description, placeholder.description),
            quantity: numberOrPlaceholder(pos.quantity, placeholder.quantity),
            unitPrice: numberOrPlaceholder(pos.unitPrice, placeholder.unitPrice),
        };
    });

    /**
     * @param {File} file
     */
    function loadLogoFromFile(file) {
        logoError = "";
        if (!allowedLogoTypes.includes(file.type)) {
            logoError = "Bitte PNG oder JPG wählen.";
            companyLogo = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            companyLogo = typeof reader.result === "string" ? reader.result : "";
        };
        reader.readAsDataURL(file);
    }

    function handleLogoUpload(/** @type {Event} */ event) {
        const target = /** @type {HTMLInputElement} */ (event.currentTarget);
        const file = target?.files?.[0];
        if (!file) return;
        loadLogoFromFile(file);
        target.value = "";
    }

    function handleLogoDragEnter(/** @type {DragEvent} */ event) {
        event.preventDefault();
        isLogoDragActive = true;
    }

    function handleLogoDragOver(/** @type {DragEvent} */ event) {
        event.preventDefault();
    }

    function handleLogoDragLeave(/** @type {DragEvent} */ event) {
        event.preventDefault();
        const target = /** @type {HTMLElement} */ (event.currentTarget);
        const related = /** @type {Node | null} */ (event.relatedTarget);
        if (!related || !target.contains(related)) {
            isLogoDragActive = false;
        }
    }

    function handleLogoDrop(/** @type {DragEvent} */ event) {
        event.preventDefault();
        isLogoDragActive = false;
        const file = event.dataTransfer?.files?.[0];
        if (file) {
            loadLogoFromFile(file);
        }
    }

    function triggerLogoInput() {
        logoFileInput?.click();
    }

    function handleLogoKeyDown(/** @type {KeyboardEvent} */ event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            triggerLogoInput();
        }
    }

    function downloadJson() {
        const offer = {
            company: {
                name: resolvedCompanyName,
                address: resolvedCompanyAddress,
                email: resolvedCompanyEmail,
                phone: resolvedCompanyPhone,
                website: resolvedCompanyWebsite,
                vatNumber: resolvedCompanyVatNumber,
                logo: companyLogo,
                bank: {
                    name: resolvedBankName,
                    location: resolvedBankLocation,
                    account: resolvedBankAccount,
                    iban: resolvedBankIban,
                    swift: resolvedBankSwift,
                },
            },
            customer: {
                name: resolvedCustomerName,
                street: resolvedCustomerStreet,
                zipCity: resolvedCustomerZipCity,
            },
            offerMeta: {
                number: resolvedOfferNumber,
                subject: resolvedOfferSubject,
                offerDate: resolvedOfferDate,
                requestDate: resolvedRequestDate,
                validityDays: resolvedOfferValidityDays,
                delivery: resolvedDeliveryText,
                contact: {
                    person: resolvedContactPerson,
                    email: resolvedContactEmail,
                    phone: resolvedContactPhone,
                },
            },
            tax: {
                vatRate: resolvedVatRate,
                discountPercent: resolvedDiscountPercent,
                discountLabel: resolvedDiscountLabel,
            },
            positions: resolvedPositions,
            totals: {
                subtotal,
                discountAmount,
                subtotalAfterDiscount,
                vatAmount,
                total,
            },
        };

        const blob = new Blob([JSON.stringify(offer, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "offerte-offertio.json";
        a.click();
        URL.revokeObjectURL(url);
    }

    async function downloadPdf() {
        if (typeof window === "undefined" || !html2pdf) return;

        isExporting = true;
        await tick(); // wait for exporting styles (scale 1, no transform jitter)
        await new Promise((resolve) => requestAnimationFrame(resolve));

        const element =
            document.getElementById("pdf-export") ||
            document.getElementById("pdf-preview");
        if (!element) {
            isExporting = false;
            return;
        }

        /** @type {any} */
        const opt = {
            margin: 0, // <--- WICHTIG: kein zusätzlicher Rand
            filename: `${resolvedOfferNumber || "offerte"}_${resolvedCompanyName || "offertio"}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 3, useCORS: true, scrollX: 0, scrollY: 0 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };

        try {
            await html2pdf().set(opt).from(element).save();
        } finally {
            isExporting = false;
        }
    }

    /**
     * @param {any} template
     */
    function applyTemplateData(template) {
        if (!template || typeof template !== "object") return;

        const company = template.company || {};
        companyName = company.name ?? companyName;
        companyAddress = company.address ?? companyAddress;
        companyEmail = company.email ?? companyEmail;
        companyPhone = company.phone ?? companyPhone;
        companyWebsite = company.website ?? companyWebsite;
        companyVatNumber = company.vatNumber ?? companyVatNumber;
        if (company.logo) {
            companyLogo = company.logo;
        }

        const bank = company.bank || {};
        bankName = bank.name ?? bankName;
        bankLocation = bank.location ?? bankLocation;
        bankAccount = bank.account ?? bankAccount;
        bankIban = bank.iban ?? bankIban;
        bankSwift = bank.swift ?? bankSwift;

        const customer = template.customer || {};
        customerName = customer.name ?? customerName;
        customerStreet = customer.street ?? customerStreet;
        customerZipCity = customer.zipCity ?? customerZipCity;

        const offerMetaData = template.offerMeta || {};
        offerNumber = offerMetaData.number ?? offerNumber;
        offerSubject = offerMetaData.subject ?? offerSubject;
        offerDate = offerMetaData.offerDate ?? offerDate;
        requestDate = offerMetaData.requestDate ?? requestDate;

        const parsedValidity = Number(offerMetaData.validityDays);
        offerValidityDays = Number.isFinite(parsedValidity)
            ? parsedValidity
            : offerValidityDays;

        deliveryText = offerMetaData.delivery ?? deliveryText;

        const contact = offerMetaData.contact || {};
        contactPerson = contact.person ?? contactPerson;
        contactEmail = contact.email ?? contactEmail;
        contactPhone = contact.phone ?? contactPhone;

        const tax = template.tax || {};
        const parsedVat = Number(tax.vatRate);
        vatRate = Number.isFinite(parsedVat) ? parsedVat : vatRate;
        const parsedDiscount = Number(tax.discountPercent);
        discountPercent = Number.isFinite(parsedDiscount)
            ? parsedDiscount
            : discountPercent;
        discountLabel = tax.discountLabel ?? discountLabel;

        if (Array.isArray(template.positions)) {
            const mapped = template.positions.map(
                (pos /** @type {{articleNumber?: string | number; description?: string; quantity?: string | number; unitPrice?: string | number;}} */) => ({
                    articleNumber: pos?.articleNumber ?? "",
                    description: pos?.description ?? "",
                    quantity: Number(pos?.quantity ?? 0) || 0,
                    unitPrice: Number(pos?.unitPrice ?? 0) || 0,
                }),
            );
            if (mapped.length) {
                positions = mapped;
            }
        }
    }

    /**
     * @param {typeof positions} list
     * @returns {{ rows: typeof positions; startIndex: number }[]}
     */
    function chunkPositions(list) {
        if (!list.length) return [{ rows: [], startIndex: 0 }];
        const chunks = [];
        const firstChunkSize = FIRST_PAGE_POSITION_ROWS;
        const followChunkSize = FOLLOWUP_PAGE_POSITION_ROWS;
        const firstRows = list.slice(0, firstChunkSize);
        chunks.push({ rows: firstRows, startIndex: 0 });
        let consumed = firstRows.length;
        while (consumed < list.length) {
            const rows = list.slice(consumed, consumed + followChunkSize);
            chunks.push({ rows, startIndex: consumed });
            consumed += rows.length;
        }
        return chunks;
    }

    $: positionChunks = chunkPositions(resolvedPositions);
    $: totalPages = positionChunks.length || 1;

    /**
     * @param {number} pageIndex
     * @param {number} rowIndex
     */
    function getPositionNumber(pageIndex, rowIndex) {
        const chunk = positionChunks[pageIndex];
        if (!chunk) return rowIndex + 1;
        return chunk.startIndex + rowIndex + 1;
    }


    function formatCurrency(/** @type {number} */ value) {
        return new Intl.NumberFormat("de-CH", {
            style: "currency",
            currency: "CHF",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value || 0);
    }

    /**
     * @param {string} iso
     */
    function formatIsoDate(iso) {
        if (!iso) return "";
        const parts = iso.split("-");
        if (parts.length === 3) {
            const [year, month, day] = parts;
            if (year && month && day) {
                return `${day}.${month}.${year}`;
            }
        }
        return iso;
    }

    /**
     * @param {string} value
     */
    function addressLines(value) {
        if (!value) return [];
        return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    }

    $: appliedPreviewScale = isExporting ? 1 : previewScale;
</script>

<section class="builder">
    <div class="builder-left">
        <h2>Offerte</h2>

        <div class="accordion">
            <div
                class="accordion-item"
                class:open={accordionState.company}
                bind:this={companySectionEl}
            >
                <div
                    class="accordion-header"
                    aria-expanded={accordionState.company}
                    aria-controls="accordion-company"
                >
                    <span>Firmendaten</span>
                    <span class="accordion-icon"
                        >{accordionState.company ? "−" : "+"}</span
                    >
                </div>
                {#if accordionState.company}
                    <div class="accordion-content" id="accordion-company">
                        <div
                            class="logo-dropzone"
                            class:dragging={isLogoDragActive}
                            role="button"
                            tabindex="0"
                            aria-label="Firmenlogo hochladen"
                            on:click={triggerLogoInput}
                            on:keydown={handleLogoKeyDown}
                            on:dragenter|preventDefault={handleLogoDragEnter}
                            on:dragover|preventDefault={handleLogoDragOver}
                            on:dragleave={handleLogoDragLeave}
                            on:drop|preventDefault={handleLogoDrop}
                        >
                            {#if companyLogo}
                                <img
                                    class="logo-dropzone-preview"
                                    src={companyLogo}
                                    alt="Firmenlogo Vorschau"
                                />
                                <p class="logo-dropzone-text">
                                    Logo ersetzen? Klicken oder neue Datei ablegen.
                                </p>
                            {:else}
                                <div class="logo-dropzone-icon" aria-hidden="true">🗂️</div>
                                <p class="logo-dropzone-text">
                                    Logo hierhin ziehen oder klicken, um PNG/JPG hochzuladen
                                </p>
                                <p class="logo-dropzone-subtext">Empfohlen: 160 × 60 px</p>
                            {/if}
                        </div>
                        <input
                            type="file"
                            class="logo-file-input"
                            accept="image/png,image/jpeg"
                            bind:this={logoFileInput}
                            on:change={handleLogoUpload}
                        />
                        {#if logoError}
                            <span class="field-error">{logoError}</span>
                        {/if}

                        <label>
                            Firmenname
                            <input
                                bind:value={companyName}
                                placeholder={PLACEHOLDERS.companyName}
                            />
                        </label>
                        <label>
                            Adresse
                            <textarea
                                rows="2"
                                bind:value={companyAddress}
                                placeholder={PLACEHOLDERS.companyAddress}
                            ></textarea>
                        </label>

                        <label>
                            E-Mail
                            <input
                                type="email"
                                bind:value={companyEmail}
                                placeholder={PLACEHOLDERS.companyEmail}
                            />
                        </label>

                        <label>
                            Telefon
                            <input
                                bind:value={companyPhone}
                                placeholder={PLACEHOLDERS.companyPhone}
                            />
                        </label>

                        <label>
                            Website
                            <input
                                bind:value={companyWebsite}
                                placeholder={PLACEHOLDERS.companyWebsite}
                            />
                        </label>

                        <label>
                            MWST-Nummer
                            <input
                                bind:value={companyVatNumber}
                                placeholder={PLACEHOLDERS.companyVatNumber}
                            />
                        </label>

                        <h4>Bankverbindung</h4>

                        <label>
                            Bankname
                            <input
                                bind:value={bankName}
                                placeholder={PLACEHOLDERS.bankName}
                            />
                        </label>

                        <label>
                            Ort
                            <input
                                bind:value={bankLocation}
                                placeholder={PLACEHOLDERS.bankLocation}
                            />
                        </label>

                        <label>
                            Kontonummer
                            <input
                                bind:value={bankAccount}
                                placeholder={PLACEHOLDERS.bankAccount}
                            />
                        </label>

                        <label>
                            IBAN
                            <input
                                bind:value={bankIban}
                                placeholder={PLACEHOLDERS.bankIban}
                            />
                        </label>

                        <label>
                            SWIFT-Code
                            <input
                                bind:value={bankSwift}
                                placeholder={PLACEHOLDERS.bankSwift}
                            />
                        </label>

                        {#if sectionErrors.company.length}
                            <div class="section-error">
                                {#each sectionErrors.company as error}
                                    <div>{error}</div>
                                {/each}
                            </div>
                        {/if}

                        <div class="accordion-footer">
                            <button
                                type="button"
                                class="next-button"
                                on:click={() => goToNext("company")}
                            >
                                Weiter
                            </button>
                        </div>
                    </div>
                {/if}
            </div>

            <div
                class="accordion-item"
                class:open={accordionState.customer}
                bind:this={customerSectionEl}
            >
                <div
                    class="accordion-header"
                    aria-expanded={accordionState.customer}
                    aria-controls="accordion-customer"
                >
                    <span>Kundendaten</span>
                    <span class="accordion-icon"
                        >{accordionState.customer ? "−" : "+"}</span
                    >
                </div>
                {#if accordionState.customer}
                    <div class="accordion-content" id="accordion-customer">
                        <label>
                            Name / Firma
                            <input
                                bind:value={customerName}
                                placeholder={PLACEHOLDERS.customerName}
                            />
                        </label>

                        <label>
                            Strasse
                            <input
                                bind:value={customerStreet}
                                placeholder={PLACEHOLDERS.customerStreet}
                            />
                        </label>

                        <label>
                            PLZ / Ort
                            <input
                                bind:value={customerZipCity}
                                placeholder={PLACEHOLDERS.customerZipCity}
                            />
                        </label>

                        {#if sectionErrors.customer.length}
                            <div class="section-error">
                                {#each sectionErrors.customer as error}
                                    <div>{error}</div>
                                {/each}
                            </div>
                        {/if}

                        <div class="accordion-footer">
                            <button
                                type="button"
                                class="next-button secondary"
                                on:click={() => goToPrevious("customer")}
                            >
                                Zurück
                            </button>
                            <button
                                type="button"
                                class="next-button"
                                on:click={() => goToNext("customer")}
                            >
                                Weiter
                            </button>
                        </div>
                    </div>
                {/if}
            </div>

            <div
                class="accordion-item"
                class:open={accordionState.offer}
                bind:this={offerSectionEl}
            >
                <div
                    class="accordion-header"
                    aria-expanded={accordionState.offer}
                    aria-controls="accordion-offer"
                >
                    <span>Offerte</span>
                    <span class="accordion-icon"
                        >{accordionState.offer ? "−" : "+"}</span
                    >
                </div>
                {#if accordionState.offer}
                    <div class="accordion-content" id="accordion-offer">
                        <label>
                            Offerte-Nr.
                            <input
                                bind:value={offerNumber}
                                placeholder={PLACEHOLDERS.offerNumber}
                            />
                        </label>

                        <label>
                            Betreff / Gegenstand der Offerte
                            <input
                                bind:value={offerSubject}
                                placeholder={PLACEHOLDERS.offerSubject}
                            />
                        </label>

                        <label>
                            Offertdatum
                            <input
                                type="date"
                                bind:value={offerDate}
                                placeholder={PLACEHOLDERS.offerDate}
                            />
                        </label>

                        <label>
                            Datum der Anfrage
                            <input
                                type="date"
                                bind:value={requestDate}
                                placeholder={PLACEHOLDERS.requestDate}
                            />
                        </label>

                        <div class="grid-2">
                            <label>
                                MWST in %
                                <input
                                    type="number"
                                    step="0.1"
                                    bind:value={vatRate}
                                    placeholder={String(PLACEHOLDERS.vatRate)}
                                />
                            </label>

                            <label>
                                Rabatt in %
                                <input
                                    type="number"
                                    step="0.1"
                                    bind:value={discountPercent}
                                    placeholder={String(PLACEHOLDERS.discountPercent)}
                                />
                            </label>
                        </div>

                        <label>
                            Rabatt-Bezeichnung
                            <input
                                bind:value={discountLabel}
                                placeholder={PLACEHOLDERS.discountLabel}
                            />
                        </label>

                        <div class="grid-2">
                            <label>
                                Gueltigkeit (Tage)
                                <input
                                    type="number"
                                    min="1"
                                    bind:value={offerValidityDays}
                                    placeholder={String(PLACEHOLDERS.offerValidityDays)}
                                />
                            </label>

                            <label>
                                Lieferfrist
                                <input
                                    bind:value={deliveryText}
                                    placeholder={PLACEHOLDERS.deliveryText}
                                />
                            </label>
                        </div>

                        {#if sectionErrors.offer.length}
                            <div class="section-error">
                                {#each sectionErrors.offer as error}
                                    <div>{error}</div>
                                {/each}
                            </div>
                        {/if}

                        <div class="accordion-footer">
                            <button
                                type="button"
                                class="next-button secondary"
                                on:click={() => goToPrevious("offer")}
                            >
                                Zurück
                            </button>
                            <button
                                type="button"
                                class="next-button"
                                on:click={() => goToNext("offer")}
                            >
                                Weiter
                            </button>
                        </div>
                    </div>
                {/if}
            </div>

            <div
                class="accordion-item"
                class:open={accordionState.contact}
                bind:this={contactSectionEl}
            >
                <div
                    class="accordion-header"
                    aria-expanded={accordionState.contact}
                    aria-controls="accordion-contact"
                >
                    <span>Ansprechpartner</span>
                    <span class="accordion-icon"
                        >{accordionState.contact ? "−" : "+"}</span
                    >
                </div>
                {#if accordionState.contact}
                    <div class="accordion-content" id="accordion-contact">
                        <label>
                            Name
                            <input
                                bind:value={contactPerson}
                                placeholder={PLACEHOLDERS.contactPerson}
                            />
                        </label>

                        <label>
                            E-Mail
                            <input
                                type="email"
                                bind:value={contactEmail}
                                placeholder={PLACEHOLDERS.contactEmail}
                            />
                        </label>

                        <label>
                            Telefon
                            <input
                                bind:value={contactPhone}
                                placeholder={PLACEHOLDERS.contactPhone}
                            />
                        </label>

                        {#if sectionErrors.contact.length}
                            <div class="section-error">
                                {#each sectionErrors.contact as error}
                                    <div>{error}</div>
                                {/each}
                            </div>
                        {/if}

                        <div class="accordion-footer">
                            <button
                                type="button"
                                class="next-button secondary"
                                on:click={() => goToPrevious("contact")}
                            >
                                Zurück
                            </button>
                            <button
                                type="button"
                                class="next-button"
                                on:click={() => goToNext("contact")}
                            >
                                Weiter
                            </button>
                        </div>
                    </div>
                {/if}
            </div>

            <div
                class="accordion-item"
                class:open={accordionState.positions}
                bind:this={positionsSectionEl}
            >
                <div
                    class="accordion-header"
                    aria-expanded={accordionState.positions}
                    aria-controls="accordion-positions"
                >
                    <span>Positionen</span>
                    <span class="accordion-icon"
                        >{accordionState.positions ? "−" : "+"}</span
                    >
                </div>
                {#if accordionState.positions}
                    <div class="accordion-content" id="accordion-positions">
                        {#each positions as pos, index}
                            {@const positionPlaceholder = getPositionPlaceholder(index)}
                            <div class="position-row">
                                <input
                                    class="pos-artnr"
                                    placeholder={positionPlaceholder.articleNumber}
                                    bind:value={pos.articleNumber}
                                />
                                <input
                                    class="pos-desc"
                                    placeholder={positionPlaceholder.description}
                                    bind:value={pos.description}
                                />
                                <input
                                    class="pos-qty"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    placeholder={String(positionPlaceholder.quantity)}
                                    bind:value={pos.quantity}
                                />
                                <input
                                    class="pos-price"
                                    type="number"
                                    min="0"
                                    step="1"
                                    placeholder={String(positionPlaceholder.unitPrice)}
                                    bind:value={pos.unitPrice}
                                />
                                <button
                                    type="button"
                                    class="small danger"
                                    on:click={() => removePosition(index)}
                                >
                                    x
                                </button>
                            </div>
                        {/each}

                        <button type="button" class="small" on:click={addPosition}>
                            + Position hinzufuegen
                        </button>

                        {#if sectionErrors.positions.length}
                            <div class="section-error">
                                {#each sectionErrors.positions as error}
                                    <div>{error}</div>
                                {/each}
                            </div>
                        {/if}

                        <div class="accordion-footer">
                            <button
                                type="button"
                                class="next-button secondary"
                                on:click={() => goToPrevious("positions")}
                            >
                                Zurück
                            </button>
                            <button
                                type="button"
                                class="next-button primary"
                                on:click={finishForm}
                            >
                                Fertig
                            </button>
                        </div>
                    </div>
                {/if}
            </div>
        </div>

        {#if showDownloads}
            <div class="finished-controls">
                <button
                    type="button"
                    class="next-button secondary"
                    on:click={reopenPositions}
                >
                    Zurück
                </button>

                <div class="download-grid">
                    <div class="download-card">
                        <div class="card-icon" aria-hidden="true">⬜</div>
                        <h4>PDF herunterladen</h4>
                        <p>
                            Erstellen Sie sofort eine formatierte PDF-Version Ihrer
                            Offerte.
                        </p>
                        <button type="button" class="card-button" on:click={downloadPdf}>
                            PDF herunterladen
                        </button>
                    </div>
                    <div class="download-card">
                        <div class="card-icon" aria-hidden="true">⬜</div>
                        <h4>JSON herunterladen</h4>
                        <p>
                            Exportieren Sie Ihre Offerte als JSON-Vorlage damit Sie beim nächsten Mal schneller sind.
                        </p>
                        <button type="button" class="card-button" on:click={downloadJson}>
                            JSON herunterladen
                        </button>
                    </div>
                </div>
            </div>
        {/if}
    </div>

    <div class="builder-right">
        <h2>Vorschau</h2>
        <div
            id="pdf-preview"
            class:exporting={isExporting}
            aria-live="polite"
            bind:this={pdfPreviewEl}
            style={`--preview-scale:${appliedPreviewScale}`}
        >
            <div class="offer-preview">
                <div class="pdf-body">
                    {#each positionChunks as chunk, pageIndex}
                        <div class="pdf-page-wrapper">
                            <article
                                class="pdf-page"
                                aria-label={`Offerte Vorschau Seite ${pageIndex + 1} von ${totalPages}`}
                            >
                                <header class="pdf-header">
                                    <div class="logo-block">
                                        <img
                                            src={companyLogo || "/offi_logo_small.png"}
                                            alt="Firmenlogo"
                                        />
                                    </div>
                                    <div class="sender-contact">
                                        <div class="sender-address">
                                            <strong>{resolvedCompanyName}</strong><br />
                                            {#each addressLines(resolvedCompanyAddress) as line}
                                                {line}<br />
                                            {/each}
                                        </div>
                                        <div>{resolvedCompanyEmail}</div>
                                        <div>{resolvedCompanyPhone}</div>
                                        <div>{resolvedCompanyWebsite}</div>
                                    </div>
                                </header>

                                <div class="customer-block">
                                    <strong>{resolvedCustomerName}</strong>
                                    <div>{resolvedCustomerStreet}</div>
                                    <div>{resolvedCustomerZipCity}</div>
                                </div>

                                <table class="offer-meta">
                                    <tbody>
                                        <tr>
                                            <td>Offerte Nr.:</td>
                                            <td>{resolvedOfferNumber}</td>
                                            <td>Ansprechpartner:</td>
                                            <td>{resolvedContactPerson}</td>
                                        </tr>
                                        <tr>
                                            <td>Datum:</td>
                                            <td>{formatIsoDate(resolvedOfferDate)}</td>
                                            <td>E-Mail:</td>
                                            <td>{resolvedContactEmail}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td>Telefon:</td>
                                            <td>{resolvedContactPhone}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="meta-spacer"></div>

                                <h3 class="offer-title">{resolvedOfferSubject}</h3>
                                <p class="intro">
                                    Sehr geehrte Damen und Herren
                                </p>
                                <p class="intro">
                                    Vielen Dank für Ihre Offertenanfrage vom {formatIsoDate(resolvedRequestDate)}.
                                    Gerne unterbreiten Ihnen unser Angebot wie folgt:
                                </p>
                                <div class="intro-spacer"></div>

                                <table class="offer-table">
                                    <colgroup>
                                        <col class="col-pos" />
                                        <col class="col-art" />
                                        <col class="col-desc" />
                                        <col class="col-qty" />
                                        <col class="col-price" />
                                        <col class="col-total" />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th class="col-pos right">Pos.</th>
                                            <th class="col-art">Art.-Nr.</th>
                                            <th class="col-desc">Bezeichnung</th>
                                            <th class="col-qty right">Menge</th>
                                            <th class="col-price right">Einzelpreis</th>
                                            <th class="col-total right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#if chunk.rows.length}
                                            {#each chunk.rows as position, rowIndex}
                                                {@const qty = Number(position.quantity) || 0}
                                                {@const unit = Number(position.unitPrice) || 0}
                                                {@const rowTotal = qty * unit}
                                                <tr>
                                                    <td class="right">
                                                        {getPositionNumber(pageIndex, rowIndex)}
                                                    </td>
                                                    <td>{position.articleNumber || "—"}</td>
                                                    <td>{position.description || "Beschreibung folgt"}</td>
                                                    <td class="right">{qty}</td>
                                                    <td class="right">{formatCurrency(unit)}</td>
                                                    <td class="right">{formatCurrency(rowTotal)}</td>
                                                </tr>
                                            {/each}
                                        {:else}
                                            <tr>
                                                <td colspan="6">Keine Positionen erfasst.</td>
                                            </tr>
                                        {/if}
                                    </tbody>
                                </table>

        {#if pageIndex === totalPages - 1}
                                    <div class="totals">
                                        {#if resolvedDiscountPercent > 0}
                                            <div class="row">
                                                <span>Zwischensumme</span>
                                                <span>{formatCurrency(subtotal)}</span>
                                            </div>
                                            <div class="row">
                                                <span>{displayDiscountLabel}</span>
                                                <span>-{formatCurrency(discountAmount)}</span>
                                            </div>
                                            <div class="row">
                                                <span>Zwischensumme</span>
                                                <span>{formatCurrency(subtotalAfterDiscount)}</span>
                                            </div>
                                        {:else}
                                            <div class="row">
                                                <span>Zwischensumme</span>
                                                <span>{formatCurrency(subtotalAfterDiscount)}</span>
                                            </div>
                                        {/if}
                                        <div class="row">
                                            <span>MWST {resolvedVatRate}%</span>
                                            <span>{formatCurrency(vatAmount)}</span>
                                        </div>
                                        <div class="row total">
                                            <span>Total</span>
                                            <span>{formatCurrency(total)}</span>
                                        </div>
                                    </div>
                                    <div class="closing">
                                        Freundliche Grüsse<br />
                                        <b>{resolvedContactPerson}</b><br />
                                        <b>{resolvedCompanyName}</b>
                                    </div>
                                    <div class="note">
                                        Mehrwertsteuer: {resolvedCompanyVatNumber}
                                        Bankverbindung: {resolvedBankName}, {resolvedBankLocation} · Konto: {resolvedBankAccount} · IBAN:
                                        {resolvedBankIban} · SWIFT: {resolvedBankSwift}
                                    </div>
                                {:else}
                                    <div class="note">Fortsetzung auf der nächsten Seite</div>
                                {/if}

                                <footer class="pdf-footer">Seite {pageIndex + 1} / {totalPages}</footer>
                            </article>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
        <div
            id="pdf-export"
            class:exporting={isExporting}
            aria-hidden={!isExporting}
        >
            <div class="pdf-export-pages">
                {#each positionChunks as chunk, pageIndex}
                    <article
                        class="pdf-page export-page"
                        aria-label={`Offerte Export Seite ${pageIndex + 1} von ${totalPages}`}
                    >
                        <header class="pdf-header">
                            <div class="logo-block">
                                <img
                                    src={companyLogo || "/offi_logo_small.png"}
                                    alt="Firmenlogo"
                                />
                            </div>
                            <div class="sender-contact">
                                <div class="sender-address">
                                    <strong>{resolvedCompanyName}</strong><br />
                                    {#each addressLines(resolvedCompanyAddress) as line}
                                        {line}<br />
                                    {/each}
                                </div>
                                <div>{resolvedCompanyEmail}</div>
                                <div>{resolvedCompanyPhone}</div>
                                <div>{resolvedCompanyWebsite}</div>
                            </div>
                        </header>

                        <div class="customer-block">
                            <strong>{resolvedCustomerName}</strong>
                            <div>{resolvedCustomerStreet}</div>
                            <div>{resolvedCustomerZipCity}</div>
                        </div>

                        <table class="offer-meta">
                            <tbody>
                                <tr>
                                    <td>Offerte Nr.:</td>
                                    <td>{resolvedOfferNumber}</td>
                                    <td>Ansprechpartner:</td>
                                    <td>{resolvedContactPerson}</td>
                                </tr>
                                <tr>
                                    <td>Datum:</td>
                                    <td>{formatIsoDate(resolvedOfferDate)}</td>
                                    <td>E-Mail:</td>
                                    <td>{resolvedContactEmail}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td>Telefon:</td>
                                    <td>{resolvedContactPhone}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="meta-spacer"></div>

                        <h3 class="offer-title">{resolvedOfferSubject}</h3>
                        <p class="intro">
                            Sehr geehrte Damen und Herren
                        </p>
                        <p class="intro">
                            Vielen Dank für Ihre Offertenanfrage vom {formatIsoDate(resolvedRequestDate)}.
                            Gerne unterbreiten Ihnen unser Angebot wie folgt:
                        </p>
                        <div class="intro-spacer"></div>

                        <table class="offer-table">
                            <colgroup>
                                <col class="col-pos" />
                                <col class="col-art" />
                                <col class="col-desc" />
                                <col class="col-qty" />
                                <col class="col-price" />
                                <col class="col-total" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th class="col-pos right">Pos.</th>
                                    <th class="col-art">Art.-Nr.</th>
                                    <th class="col-desc">Bezeichnung</th>
                                    <th class="col-qty right">Menge</th>
                                    <th class="col-price right">Einzelpreis</th>
                                    <th class="col-total right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#if chunk.rows.length}
                                    {#each chunk.rows as position, rowIndex}
                                        {@const qty = Number(position.quantity) || 0}
                                        {@const unit = Number(position.unitPrice) || 0}
                                        {@const rowTotal = qty * unit}
                                        <tr>
                                            <td class="right">
                                                {getPositionNumber(pageIndex, rowIndex)}
                                            </td>
                                            <td>{position.articleNumber || "—"}</td>
                                            <td>{position.description || "Beschreibung folgt"}</td>
                                            <td class="right">{qty}</td>
                                            <td class="right">{formatCurrency(unit)}</td>
                                            <td class="right">{formatCurrency(rowTotal)}</td>
                                        </tr>
                                    {/each}
                                {:else}
                                    <tr>
                                        <td colspan="6">Keine Positionen erfasst.</td>
                                    </tr>
                                {/if}
                            </tbody>
                        </table>

                        {#if pageIndex === totalPages - 1}
                            <div class="totals">
                                {#if resolvedDiscountPercent > 0}
                                    <div class="row">
                                        <span>Zwischensumme</span>
                                        <span>{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div class="row">
                                        <span>{displayDiscountLabel}</span>
                                        <span>-{formatCurrency(discountAmount)}</span>
                                    </div>
                                    <div class="row">
                                        <span>Zwischensumme</span>
                                        <span>{formatCurrency(subtotalAfterDiscount)}</span>
                                    </div>
                                {:else}
                                    <div class="row">
                                        <span>Zwischensumme</span>
                                        <span>{formatCurrency(subtotalAfterDiscount)}</span>
                                    </div>
                                {/if}
                                <div class="row">
                                    <span>MWST {resolvedVatRate}%</span>
                                    <span>{formatCurrency(vatAmount)}</span>
                                </div>
                                <div class="row total">
                                    <span>Total</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>
                            <div class="closing">
                                Freundliche Grüsse<br />
                                <b>{resolvedContactPerson}</b><br />
                                <b>{resolvedCompanyName}</b>
                            </div>
                            <div class="note">
                                Mehrwertsteuer: {resolvedCompanyVatNumber}
                                Bankverbindung: {resolvedBankName}, {resolvedBankLocation} · Konto: {resolvedBankAccount} · IBAN:
                                {resolvedBankIban} · SWIFT: {resolvedBankSwift}
                            </div>
                        {:else}
                            <div class="note">Fortsetzung auf der nächsten Seite</div>
                        {/if}

                        <footer class="pdf-footer">Seite {pageIndex + 1} / {totalPages}</footer>
                    </article>
                {/each}
            </div>
        </div>
        <p class="page-indicator-text">
            Vorschau aktualisiert sich automatisch beim ausfüllen.
        </p>
    </div>
</section>
<style>
    .builder {
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.1fr);
        gap: 1.5rem;
        align-items: flex-start;
    }

    .builder-left,
    .builder-right {
        min-width: 0;
    }

    .builder-left {
        position: relative;
        z-index: 2;
    }

    .builder-right {
        width: auto;
        position: relative;
        z-index: 1;
    }


    .accordion {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-top: 0.5rem;
    }

    .accordion-item {
        border: 1px solid #e5e7eb;
        border-radius: 0.3rem;
        background: #f9fafb;
        overflow: hidden;
        transition: border-color 0.2s ease, box-shadow 0.2s ease,
            background 0.2s ease;
    }

    .accordion-item.open {
        background: #fff;
        border-color: #d1d5db;
        box-shadow: 0 6px 14px rgba(0, 0, 0, 0.05);
    }

    .accordion-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.9rem 1rem;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: default;
        color: #111827;
    }

    .accordion-icon {
        font-size: 1.2rem;
        line-height: 1;
    }

    .accordion-content {
        padding: 0.4rem 1rem 1rem;
    }

    .accordion-footer {
        margin-top: 0.75rem;
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .next-button {
        border: none;
        background: #84c1ff;
        color: #0b2a57;
        padding: 0.45rem 1.1rem;
        border-radius: 0.45rem;
        font-size: 0.9rem;
        cursor: pointer;
        transition: background 0.2s ease;
    }

    .next-button:hover {
        background: #63abf4;
    }

    .next-button.secondary {
        background: #dadde2;
        color: #2f3641;
    }

    .next-button.secondary:hover {
        background: #c4c9d1;
    }

    .next-button.primary {
        background: #2563eb;
        color: white;
    }

    .next-button.primary:hover {
        background: #1d4ed8;
    }

    .finished-controls {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-top: 1rem;
    }

    .download-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
    }

    .download-card {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 0.9rem;
        padding: 1.1rem;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
    }

    .card-icon {
        width: 82px;
        height: 82px;
        border-radius: 0.75rem;
        background: #eef2ff;
        color: #6b7280;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        align-self: center;
    }

    .download-card h4 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
    }

    .download-card p {
        margin: 0;
        font-size: 0.9rem;
        color: #4b5563;
        line-height: 1.4;
        flex: 1;
    }

    .card-button {
        margin-top: 0.4rem;
        padding: 0.55rem 0.9rem;
        background: #013364;
        color: white;
        border: none;
        border-radius: 0.45rem;
        font-size: 0.9rem;
        cursor: pointer;
        transition: background 0.2s ease;
    }

    .card-button:hover {
        background: #012348;
    }

    h2 {
        margin-top: 0;
        margin-bottom: 0.75rem;
    }

    h3 {
        margin-top: 1.25rem;
        margin-bottom: 0.5rem;
        font-size: 1rem;
    }

    h4 {
        margin-top: 1rem;
        margin-bottom: 0.4rem;
        font-size: 0.9rem;
        font-weight: 600;
    }

    label {
        display: block;
        font-size: 0.85rem;
        margin-bottom: 0.5rem;
    }

    .logo-dropzone {
        border: 2px dashed #c7d1e0;
        border-radius: 0.8rem;
        padding: 1.4rem;
        text-align: center;
        background: #f8fbff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        margin-bottom: 0.9rem;
        outline: none;
    }

    .logo-dropzone.dragging {
        border-color: #84c1ff;
        background: #eef5ff;
        box-shadow: 0 12px 28px rgba(1, 51, 100, 0.12);
    }

    .logo-dropzone:focus-visible {
        box-shadow: 0 0 0 3px rgba(132, 193, 255, 0.6);
        border-color: #84c1ff;
    }

    .logo-dropzone-icon {
        font-size: 2.4rem;
        margin-bottom: 0.5rem;
    }

    .logo-dropzone-text {
        margin: 0.25rem 0;
        font-size: 0.92rem;
        font-weight: 600;
        color: #0b2a57;
    }

    .logo-dropzone-subtext {
        margin: 0;
        font-size: 0.8rem;
        color: #6b7280;
    }

    .logo-dropzone-preview {
        display: block;
        max-width: 240px;
        max-height: 110px;
        margin: 0 auto 0.75rem;
        object-fit: contain;
    }

    .logo-file-input {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
    }

    .field-error {
        display: block;
        margin-top: 0.2rem;
        font-size: 0.75rem;
        color: #b45309;
    }

    .section-error {
        margin-top: 0.6rem;
        padding: 0.65rem 0.75rem;
        border-radius: 0.45rem;
        border: 1px solid #fecdd3;
        background: #fff1f2;
        color: #b91c1c;
        font-size: 0.85rem;
        line-height: 1.3;
    }

    input,
    textarea {
        width: 100%;
        margin-top: 0.2rem;
        padding: 0.4rem 0.5rem;
        border-radius: 0.35rem;
        border: 1px solid #d1d5db;
        font-size: 0.9rem;
        box-sizing: border-box;
    }

    textarea {
        resize: vertical;
    }

    .grid-2 {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
        margin-bottom: 0.5rem;
    }

    .position-row {
        display: grid;
        grid-template-columns: 0.9fr 2.2fr 0.7fr 0.9fr auto;
        gap: 0.4rem;
        margin-bottom: 0.4rem;
        align-items: center;
    }

    .pos-artnr {
        text-align: left;
    }

    .pos-qty,
    .pos-price {
        text-align: right;
    }

    .small {
        font-size: 0.8rem;
        padding: 0.3rem 0.6rem;
        border-radius: 0.35rem;
        border: 1px solid #d1d5db;
        background: #e5e7eb;
        cursor: pointer;
    }

    .small.danger {
        background: #fee2e2;
        border-color: #fecaca;
        color: #991b1b;
    }

    .small:hover {
        background: #d1d5db;
    }

    .offer-preview {
        background: transparent;
        border-radius: 0;
        border: none;
        padding: 0;
        font-size: 0.9rem;
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
    }

    #pdf-preview.exporting .pdf-page,
    #pdf-preview.exporting .offer-preview {
        height: auto;
    }

    #pdf-export {
        display: none;
    }

    #pdf-export.exporting {
        display: block;
        position: static;
        overflow: visible;
        padding: 0;
    }

    #pdf-export .pdf-export-pages {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0;
    }

    #pdf-export .pdf-page {
        position: static;
        left: auto;
        top: auto;
        transform: none;
        margin: 0 auto 0.5rem;
        border: none;
        box-shadow: none;
        page-break-after: always;
        --preview-scale: 1;
    }

    #pdf-export .pdf-page:last-child {
        page-break-after: auto;
        margin-bottom: 0;
    }

    .pdf-body {
        flex: 1 1 auto;
        width: 100%;
        display: block;
    }



    .customer-block {
        margin-bottom: 0.75rem;
        font-size: 0.9rem;
    }

    .offer-title {
        margin: 0.5rem 0 0.75rem;
        font-size: 1rem;
    }

    .totals {
        margin-top: 0.5rem;
    }

    .totals .row {
        display: flex;
        justify-content: space-between;
        column-gap: 1.25rem;
        margin-bottom: 0.2rem;
    }

    .totals .total {
        font-weight: 600;
        margin-top: 0.4rem;
        border-top: 1px solid #e5e7eb;
        padding-top: 0.3rem;
    }

    #pdf-preview {
        display: flex;
        flex-direction: column;
        gap: 0.9rem;
        width: 100%;
        max-width: 100%;
        align-items: center;
    }

    .pdf-page-wrapper {
        --page-width: 210mm;
        --page-height: 296mm;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        overflow: visible;
        padding: 0;
        box-sizing: border-box;
        position: relative;
        height: calc(var(--page-height) * var(--preview-scale, 1));
        min-height: calc(var(--page-height) * var(--preview-scale, 1));

    }

    #pdf-preview.exporting .pdf-page-wrapper {
        height: var(--page-height);
        min-height: var(--page-height);
    }

    .pdf-page {
        width: var(--page-width, 210mm);
        min-height: var(--page-height, 296mm);
        padding: 20mm 20mm 25mm 20mm;
        background: white;
        border: 1px solid #e5e7eb; /* nur für die Vorschau im Browser */
        box-sizing: border-box;
        margin: 0;
        font-size: 11px;
        line-height: 1.4;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
            sans-serif;
        display: flex;
        flex-direction: column;
        page-break-after: always;
        transform-origin: top center;
        transform: translateX(-50%) scale(var(--preview-scale, 1));
        transition: transform 0.15s ease;
        position: absolute;
        top: 0;
        left: 50%;
    }

    #pdf-preview.exporting .pdf-page {
        transform: translateX(-50%) scale(1);
    }

    .pdf-page:last-child {
        page-break-after: auto;
    }



    .pdf-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .logo-block {
        min-height: 60px;
        max-width: 200px;
        display: flex;
        align-items: center;
    }

    .logo-block img {
        display: block;
        max-height: 60px;
        max-width: 200px;
        width: auto;
        height: auto;
        object-fit: contain;
    }

    .pdf-footer {
        margin-top: auto;
        padding-top: 1.5rem;
        text-align: center;
        font-size: 0.8rem;
        line-height: 1.5;
        color: #374151;
    }

    .page-indicator-text {
        margin-top: 0.5rem;
        text-align: center;
        font-size: 0.85rem;
        color: #6b7280;
    }

    .sender-contact {
        text-align: right;
        font-size: 0.85rem;
    }

    .sender-contact .sender-address {
        margin-bottom: 0.4rem;
        font-size: 0.85rem;
    }

    .customer-block {
        margin-bottom: 1rem;
        font-size: 0.9rem;
    }

    .offer-meta {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 0.8rem;
        font-size: 0.9rem;
    }

    .meta-spacer {
        height: 0.5rem;
    }

    .offer-meta td {
        padding: 0.15rem 0.3rem 0.15rem 0;
    }

    .offer-meta td:first-child,
    .offer-meta td:nth-child(3) {
        width: 18%;
        font-weight: 600;
    }
    .offer-meta td:nth-child(2),
    .offer-meta td:nth-child(4) {
        width: 32%;
    }

    .offer-title {
        margin: 0.4rem 0 0.8rem;
        font-size: 1rem;
        font-weight: 600;
    }

    .intro {
        margin: 0 0 0.5rem;
        font-size: 0.9rem;
    }

    .note {
        margin-top: 1rem;
        font-size: 0.7rem;
        text-align: center;
    }

    .intro-spacer {
        height: 0.75rem;
    }

    .closing {
        margin-top: 1.2rem;
        font-size: 0.9rem;
    }

    .offer-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 0.8rem;
        font-size: 0.9rem;
        table-layout: fixed;
    }

    .offer-table th,
    .offer-table td {
        border-bottom: 1px solid #e5e7eb;
        padding: 0.35rem 0.3rem;
        text-align: left;
        vertical-align: top;
        white-space: normal;
        word-break: break-word;
    }

    .offer-table thead th {
        border-bottom: 1.5px solid #9ca3af;
        font-weight: 600;
    }

    .offer-table .right {
        text-align: right;
    }

    .offer-table col.col-pos {
        width: 8%;
    }

    .offer-table col.col-art {
        width: 12%;
    }

    .offer-table col.col-desc {
        width: 40%;
    }

    .offer-table col.col-qty {
        width: 10%;
    }

    .offer-table col.col-price,
    .offer-table col.col-total {
        width: 15%;
    }

    .offer-table th.col-qty,
    .offer-table th.col-price,
    .offer-table th.col-total,
    .offer-table td:nth-child(4),
    .offer-table td:nth-child(5),
    .offer-table td:nth-child(6) {
        white-space: nowrap;
    }

    .offer-table th.col-desc,
    .offer-table td:nth-child(3) {
        white-space: normal;
    }

    .offer-table tr {
        break-inside: avoid;
        page-break-inside: avoid;
    }

    .totals {
        margin-top: 0.5rem;
        max-width: 260px;
        margin-left: auto; /* rechtsbündig wie in Word */
        font-size: 0.9rem;
    }

    .totals .row {
        display: flex;
        justify-content: space-between;
        column-gap: 1.25rem;
        margin-bottom: 0.2rem;
    }

    .totals .total {
        font-weight: 600;
        margin-top: 0.3rem;
        border-top: 1px solid #9ca3af;
        padding-top: 0.3rem;
    }

    @media (max-width: 900px) {
        .builder {
            grid-template-columns: minmax(0, 1fr);
        }
    }
</style>
