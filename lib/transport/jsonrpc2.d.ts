/** A String specifying the version of the JSON-RPC protocol. MUST be exactly "2.0". */
export declare type JsonRpcVersion = '2.0';
/** Method names that begin with the word rpc followed by a period character
 * (U+002E or ASCII 46) are reserved for rpc-internal methods and extensions
 *  and MUST NOT be used for anything else. */
export declare type JsonRpcReservedMethod = string;
/** An identifier established by the Client that MUST contain a String, Number,
 *  or NULL value if included. If it is not included it is assumed to be a
 *  notification. The value SHOULD normally not be Null and Numbers SHOULD
 *  NOT contain fractional parts [2] */
export declare type JsonRpcId = number | string | void;
/**
 * method:
 * A String containing the name of the method to be invoked.
 * Method names that begin with the word rpc followed by a period
 * character (U+002E or ASCII 46) are reserved for rpc-internal methods
 * and extensions and MUST NOT be used for anything else.
 *
 * params:
 * A Structured value that holds the parameter values to be used
 * during the invocation of the method. This member MAY be omitted.
 */
export interface JsonRpcNotification<T> {
    jsonrpc: JsonRpcVersion;
    method: string;
    params?: T;
}
export interface JsonRpcRequest<T> extends JsonRpcNotification<T> {
    id: JsonRpcId;
}
export interface JsonRpcResponseBase {
    jsonrpc: JsonRpcVersion;
    id: JsonRpcId;
}
export interface JsonRpcSuccess<T = object> extends JsonRpcResponseBase {
    result: T;
}
export declare function isJsonRpcSuccess(response: object): response is JsonRpcSuccess;
export interface JsonRpcFailure<T> extends JsonRpcResponseBase {
    error: JsonRpcError<T>;
}
export interface JsonRpcError<T = object> {
    /** Must be an integer */
    code: number;
    message: string;
    data?: T;
}
export declare type JsonRpcResponse<T> = JsonRpcSuccess<T> | JsonRpcFailure<T>;
/** An error occurred on the server while parsing the JSON text. */
export declare const PARSE_ERROR = -32700;
/** The JSON sent is not a valid Request object. */
export declare const INVALID_REQUEST = -32600;
/** The method does not exist / is not available. */
export declare const METHOD_NOT_FOUND = -32601;
/** Invalid method parameter(s). */
export declare const INVALID_PARAMS = -32602;
/** Internal JSON-RPC error. */
export declare const INTERNAL_ERROR = -32603;
