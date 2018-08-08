export declare function genPrivKeyHex(): string;
export declare function pubKeyFromPrivate(privKeyHex: string): string;
export declare function isValidUsername(username: string): boolean;
export declare function isKeyMatch(privKeyHex: string, pubKeyHex: string): boolean;
export declare function derivePrivKey(privKeyHex: any): string;
export declare function signWithSha256(msg: any, privKeyHex: string): any;
export declare function verifyWithSha256(msg: any, pubKeyHex: string, signature: any): boolean;
