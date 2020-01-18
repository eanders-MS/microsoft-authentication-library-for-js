/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { ClientAuthError } from "../error/ClientAuthError";
import { ServerError } from "../error/ServerError";
import { buildClientInfo, ClientInfo } from "../auth/ClientInfo";
import { ICrypto } from "../crypto/ICrypto";
import { Logger } from "../logger/Logger";

/**
 * Deserialized response object from server authorization code request.
 * - code: authorization code from server
 * - client_info: client info object
 * - state: OAuth2 request state
 * - error: error sent back in hash
 * - error: description
 */
export type ServerAuthorizationCodeResponse = {
    code?: string;
    client_info?: string;
    state?: string;
    error?: string,
    error_description?: string;
};

export function validateServerAuthorizationCodeResponse(serverResponseHash: ServerAuthorizationCodeResponse, cachedState: string, cryptoObj: ICrypto, logger: Logger): void {
    if (serverResponseHash.state !== cachedState) {
        throw ClientAuthError.createStateMismatchError();
    }

    // Check for error
    if (serverResponseHash.error || serverResponseHash.error_description) {
        throw new ServerError(serverResponseHash.error, serverResponseHash.error_description);
    }

    if (serverResponseHash.client_info) {
        buildClientInfo(serverResponseHash.client_info, cryptoObj);
    }
}