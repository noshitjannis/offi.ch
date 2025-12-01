import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEY_LENGTH = 64;

export const hashPassword = (password: string) => {
	const salt = randomBytes(16);
	const hash = scryptSync(password, salt, KEY_LENGTH);
	return `${salt.toString("hex")}:${hash.toString("hex")}`;
};

export const verifyPassword = (password: string, stored: string) => {
	const [saltHex, hashHex] = stored.split(":");
	if (!saltHex || !hashHex) return false;

	const salt = Buffer.from(saltHex, "hex");
	const storedHash = Buffer.from(hashHex, "hex");
	const candidateHash = scryptSync(password, salt, KEY_LENGTH);

	return (
		candidateHash.length === storedHash.length && timingSafeEqual(candidateHash, storedHash)
	);
};
