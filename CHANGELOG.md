# 🧾 Changelog

All notable changes in this project will be documented in this file.


## 1.0.0 (2026-04-25)

### ⚠ BREAKING CHANGE

* **Security:** Complete redesign of the security layer with zero-trust principles, unified policy enforcement,
and integration with @omnixys/auth and @omnixys/context.
Legacy security utilities and inconsistent implementations have been removed.

✨ Features:
- Zero-Trust security architecture for distributed microservices
- Seamless integration with @omnixys/auth (identity) and @omnixys/context (request state)
- JWE encryption module:
  - Secure payload encryption/decryption (AES-GCM)
  - Keyring support with multiple KIDs and rotation strategies
- Secure session handling:
  - Cookie-based sessions (HTTP-only, secure, same-site)
  - Stateless + hybrid session strategies
- Role-Based Access Control (RBAC):
  - RoleGuard with fine-grained access checks
  - Context-aware role resolution (actorId, tenantId)
- Rate limiting:
  - In-memory and distributed (Valkey) stores
  - Flexible throttling strategies (IP, user, device)
- Hashing utilities:
  - HMAC-based signing and verification
  - Secure hashing helpers for tokens and secrets
- CookieService:
  - Standardized cookie creation, parsing, and security flags
- Security guards:
  - ZeroTrustGuard
  - CookieAuthGuard
  - RoleGuard
- Device-aware security primitives (foundation for device trust & step-up auth)

⚙️ Improvements:
- Unified security APIs across all Omnixys services
- Strong typing for all security-related operations
- Reduced duplication of auth + security logic
- Consistent handling of cookies, tokens, and encryption
- Improved extensibility for advanced security flows (MFA, WebAuthn)

🧱 Architecture:
- Modular NestJS dynamic module (SecurityModule.forRoot / forRootAsync)
- Clear separation of concerns:
  - Authentication → @omnixys/auth
  - Enforcement → @omnixys/security
- Pluggable stores (in-memory, Valkey) for rate limiting and risk memory
- Key management abstraction (JWE, HMAC)

🛑 Removed / Changed:
- Removed legacy security helpers and duplicated implementations
- Replaced ad-hoc encryption and hashing with standardized modules
- Deprecated inconsistent guard patterns and manual cookie handling

📦 Compatibility:
- Requires Node.js >= 20
- Designed for NestJS-based microservices
- Fully compatible with:
  - @omnixys/auth (identity & JWT handling)
  - @omnixys/context (request context propagation)
  - @omnixys/cache (Valkey for rate limiting & risk memory)
  - @omnixys/observability (security event tracing)

📚 Notes:
This release establishes the enterprise-grade security foundation for all Omnixys services,
enabling zero-trust enforcement, secure session handling, and extensible security mechanisms
for modern distributed architectures.
* **Security:** Complete redesign of the security layer with zero-trust principles, unified policy enforcement,
and integration with @omnixys/auth and @omnixys/context.
Legacy security utilities and inconsistent implementations have been removed.

✨ Features:
- Zero-Trust security architecture for distributed microservices
- Seamless integration with @omnixys/auth (identity) and @omnixys/context (request state)
- JWE encryption module:
  - Secure payload encryption/decryption (AES-GCM)
  - Keyring support with multiple KIDs and rotation strategies
- Secure session handling:
  - Cookie-based sessions (HTTP-only, secure, same-site)
  - Stateless + hybrid session strategies
- Role-Based Access Control (RBAC):
  - RoleGuard with fine-grained access checks
  - Context-aware role resolution (actorId, tenantId)
- Rate limiting:
  - In-memory and distributed (Valkey) stores
  - Flexible throttling strategies (IP, user, device)
- Hashing utilities:
  - HMAC-based signing and verification
  - Secure hashing helpers for tokens and secrets
- CookieService:
  - Standardized cookie creation, parsing, and security flags
- Security guards:
  - ZeroTrustGuard
  - CookieAuthGuard
  - RoleGuard
- Device-aware security primitives (foundation for device trust & step-up auth)

⚙️ Improvements:
- Unified security APIs across all Omnixys services
- Strong typing for all security-related operations
- Reduced duplication of auth + security logic
- Consistent handling of cookies, tokens, and encryption
- Improved extensibility for advanced security flows (MFA, WebAuthn)

🧱 Architecture:
- Modular NestJS dynamic module (SecurityModule.forRoot / forRootAsync)
- Clear separation of concerns:
  - Authentication → @omnixys/auth
  - Enforcement → @omnixys/security
- Pluggable stores (in-memory, Valkey) for rate limiting and risk memory
- Key management abstraction (JWE, HMAC)

🛑 Removed / Changed:
- Removed legacy security helpers and duplicated implementations
- Replaced ad-hoc encryption and hashing with standardized modules
- Deprecated inconsistent guard patterns and manual cookie handling

📦 Compatibility:
- Requires Node.js >= 20
- Designed for NestJS-based microservices
- Fully compatible with:
  - @omnixys/auth (identity & JWT handling)
  - @omnixys/context (request context propagation)
  - @omnixys/cache (Valkey for rate limiting & risk memory)
  - @omnixys/observability (security event tracing)

📚 Notes:
This release establishes the enterprise-grade security foundation for all Omnixys services,
enabling zero-trust enforcement, secure session handling, and extensible security mechanisms
for modern distributed architectures.
* **Security:** Complete redesign of the security layer with zero-trust principles, unified policy enforcement,
and integration with @omnixys/auth and @omnixys/context.
Legacy security utilities and inconsistent implementations have been removed.

✨ Features:
- Zero-Trust security architecture for distributed microservices
- Seamless integration with @omnixys/auth (identity) and @omnixys/context (request state)
- JWE encryption module:
  - Secure payload encryption/decryption (AES-GCM)
  - Keyring support with multiple KIDs and rotation strategies
- Secure session handling:
  - Cookie-based sessions (HTTP-only, secure, same-site)
  - Stateless + hybrid session strategies
- Role-Based Access Control (RBAC):
  - RoleGuard with fine-grained access checks
  - Context-aware role resolution (actorId, tenantId)
- Rate limiting:
  - In-memory and distributed (Valkey) stores
  - Flexible throttling strategies (IP, user, device)
- Hashing utilities:
  - HMAC-based signing and verification
  - Secure hashing helpers for tokens and secrets
- CookieService:
  - Standardized cookie creation, parsing, and security flags
- Security guards:
  - ZeroTrustGuard
  - CookieAuthGuard
  - RoleGuard
- Device-aware security primitives (foundation for device trust & step-up auth)

⚙️ Improvements:
- Unified security APIs across all Omnixys services
- Strong typing for all security-related operations
- Reduced duplication of auth + security logic
- Consistent handling of cookies, tokens, and encryption
- Improved extensibility for advanced security flows (MFA, WebAuthn)

🧱 Architecture:
- Modular NestJS dynamic module (SecurityModule.forRoot / forRootAsync)
- Clear separation of concerns:
  - Authentication → @omnixys/auth
  - Enforcement → @omnixys/security
- Pluggable stores (in-memory, Valkey) for rate limiting and risk memory
- Key management abstraction (JWE, HMAC)

🛑 Removed / Changed:
- Removed legacy security helpers and duplicated implementations
- Replaced ad-hoc encryption and hashing with standardized modules
- Deprecated inconsistent guard patterns and manual cookie handling

📦 Compatibility:
- Requires Node.js >= 20
- Designed for NestJS-based microservices
- Fully compatible with:
  - @omnixys/auth (identity & JWT handling)
  - @omnixys/context (request context propagation)
  - @omnixys/cache (Valkey for rate limiting & risk memory)
  - @omnixys/observability (security event tracing)

📚 Notes:
This release establishes the enterprise-grade security foundation for all Omnixys services,
enabling zero-trust enforcement, secure session handling, and extensible security mechanisms
for modern distributed architectures.

### Release

* **Release:** 1.0.0 [skip ci] ([](https://github.com/omnixys/security/commit/426cc0d398a652586bf8252e8ccc38d5f955f8d6))
* **Release:** 1.0.0 [skip ci] ([](https://github.com/omnixys/security/commit/21fad3157cdedaa99efc8b228a73231e60d789b8))

### Security

* **Security:**  zero-trust security, encryption & policy enforcement ([](https://github.com/omnixys/security/commit/476887bf302f83e111b8355f91f06ad6bbfd4a3a))
* **Security:**  zero-trust security, encryption & policy enforcement ([](https://github.com/omnixys/security/commit/5db3c4c012b61da737d5865d9a5c4f8e7604b3d4))
* **Security:**  zero-trust security, encryption & policy enforcement ([](https://github.com/omnixys/security/commit/62e7891e3c837834f0d558d1f0594c7481e69281))

### U

* **U:** u ([](https://github.com/omnixys/security/commit/62118d766fdc37fcd24eb9219598e3c171361283))
* **U:** u ([](https://github.com/omnixys/security/commit/0958470937acd6a6a259aea9c2bc5bb1eb530442))

### Update

* **Update:** update ([](https://github.com/omnixys/security/commit/7ba708d1e88d8cee11a8b7d3b7e91d919bb2ae74))

## 1.0.0 (2026-04-25)

### ⚠ BREAKING CHANGE

* **Security:** Complete redesign of the security layer with zero-trust principles, unified policy enforcement,
and integration with @omnixys/auth and @omnixys/context.
Legacy security utilities and inconsistent implementations have been removed.

✨ Features:
- Zero-Trust security architecture for distributed microservices
- Seamless integration with @omnixys/auth (identity) and @omnixys/context (request state)
- JWE encryption module:
  - Secure payload encryption/decryption (AES-GCM)
  - Keyring support with multiple KIDs and rotation strategies
- Secure session handling:
  - Cookie-based sessions (HTTP-only, secure, same-site)
  - Stateless + hybrid session strategies
- Role-Based Access Control (RBAC):
  - RoleGuard with fine-grained access checks
  - Context-aware role resolution (actorId, tenantId)
- Rate limiting:
  - In-memory and distributed (Valkey) stores
  - Flexible throttling strategies (IP, user, device)
- Hashing utilities:
  - HMAC-based signing and verification
  - Secure hashing helpers for tokens and secrets
- CookieService:
  - Standardized cookie creation, parsing, and security flags
- Security guards:
  - ZeroTrustGuard
  - CookieAuthGuard
  - RoleGuard
- Device-aware security primitives (foundation for device trust & step-up auth)

⚙️ Improvements:
- Unified security APIs across all Omnixys services
- Strong typing for all security-related operations
- Reduced duplication of auth + security logic
- Consistent handling of cookies, tokens, and encryption
- Improved extensibility for advanced security flows (MFA, WebAuthn)

🧱 Architecture:
- Modular NestJS dynamic module (SecurityModule.forRoot / forRootAsync)
- Clear separation of concerns:
  - Authentication → @omnixys/auth
  - Enforcement → @omnixys/security
- Pluggable stores (in-memory, Valkey) for rate limiting and risk memory
- Key management abstraction (JWE, HMAC)

🛑 Removed / Changed:
- Removed legacy security helpers and duplicated implementations
- Replaced ad-hoc encryption and hashing with standardized modules
- Deprecated inconsistent guard patterns and manual cookie handling

📦 Compatibility:
- Requires Node.js >= 20
- Designed for NestJS-based microservices
- Fully compatible with:
  - @omnixys/auth (identity & JWT handling)
  - @omnixys/context (request context propagation)
  - @omnixys/cache (Valkey for rate limiting & risk memory)
  - @omnixys/observability (security event tracing)

📚 Notes:
This release establishes the enterprise-grade security foundation for all Omnixys services,
enabling zero-trust enforcement, secure session handling, and extensible security mechanisms
for modern distributed architectures.
* **Security:** Complete redesign of the security layer with zero-trust principles, unified policy enforcement,
and integration with @omnixys/auth and @omnixys/context.
Legacy security utilities and inconsistent implementations have been removed.

✨ Features:
- Zero-Trust security architecture for distributed microservices
- Seamless integration with @omnixys/auth (identity) and @omnixys/context (request state)
- JWE encryption module:
  - Secure payload encryption/decryption (AES-GCM)
  - Keyring support with multiple KIDs and rotation strategies
- Secure session handling:
  - Cookie-based sessions (HTTP-only, secure, same-site)
  - Stateless + hybrid session strategies
- Role-Based Access Control (RBAC):
  - RoleGuard with fine-grained access checks
  - Context-aware role resolution (actorId, tenantId)
- Rate limiting:
  - In-memory and distributed (Valkey) stores
  - Flexible throttling strategies (IP, user, device)
- Hashing utilities:
  - HMAC-based signing and verification
  - Secure hashing helpers for tokens and secrets
- CookieService:
  - Standardized cookie creation, parsing, and security flags
- Security guards:
  - ZeroTrustGuard
  - CookieAuthGuard
  - RoleGuard
- Device-aware security primitives (foundation for device trust & step-up auth)

⚙️ Improvements:
- Unified security APIs across all Omnixys services
- Strong typing for all security-related operations
- Reduced duplication of auth + security logic
- Consistent handling of cookies, tokens, and encryption
- Improved extensibility for advanced security flows (MFA, WebAuthn)

🧱 Architecture:
- Modular NestJS dynamic module (SecurityModule.forRoot / forRootAsync)
- Clear separation of concerns:
  - Authentication → @omnixys/auth
  - Enforcement → @omnixys/security
- Pluggable stores (in-memory, Valkey) for rate limiting and risk memory
- Key management abstraction (JWE, HMAC)

🛑 Removed / Changed:
- Removed legacy security helpers and duplicated implementations
- Replaced ad-hoc encryption and hashing with standardized modules
- Deprecated inconsistent guard patterns and manual cookie handling

📦 Compatibility:
- Requires Node.js >= 20
- Designed for NestJS-based microservices
- Fully compatible with:
  - @omnixys/auth (identity & JWT handling)
  - @omnixys/context (request context propagation)
  - @omnixys/cache (Valkey for rate limiting & risk memory)
  - @omnixys/observability (security event tracing)

📚 Notes:
This release establishes the enterprise-grade security foundation for all Omnixys services,
enabling zero-trust enforcement, secure session handling, and extensible security mechanisms
for modern distributed architectures.
* **Security:** Complete redesign of the security layer with zero-trust principles, unified policy enforcement,
and integration with @omnixys/auth and @omnixys/context.
Legacy security utilities and inconsistent implementations have been removed.

✨ Features:
- Zero-Trust security architecture for distributed microservices
- Seamless integration with @omnixys/auth (identity) and @omnixys/context (request state)
- JWE encryption module:
  - Secure payload encryption/decryption (AES-GCM)
  - Keyring support with multiple KIDs and rotation strategies
- Secure session handling:
  - Cookie-based sessions (HTTP-only, secure, same-site)
  - Stateless + hybrid session strategies
- Role-Based Access Control (RBAC):
  - RoleGuard with fine-grained access checks
  - Context-aware role resolution (actorId, tenantId)
- Rate limiting:
  - In-memory and distributed (Valkey) stores
  - Flexible throttling strategies (IP, user, device)
- Hashing utilities:
  - HMAC-based signing and verification
  - Secure hashing helpers for tokens and secrets
- CookieService:
  - Standardized cookie creation, parsing, and security flags
- Security guards:
  - ZeroTrustGuard
  - CookieAuthGuard
  - RoleGuard
- Device-aware security primitives (foundation for device trust & step-up auth)

⚙️ Improvements:
- Unified security APIs across all Omnixys services
- Strong typing for all security-related operations
- Reduced duplication of auth + security logic
- Consistent handling of cookies, tokens, and encryption
- Improved extensibility for advanced security flows (MFA, WebAuthn)

🧱 Architecture:
- Modular NestJS dynamic module (SecurityModule.forRoot / forRootAsync)
- Clear separation of concerns:
  - Authentication → @omnixys/auth
  - Enforcement → @omnixys/security
- Pluggable stores (in-memory, Valkey) for rate limiting and risk memory
- Key management abstraction (JWE, HMAC)

🛑 Removed / Changed:
- Removed legacy security helpers and duplicated implementations
- Replaced ad-hoc encryption and hashing with standardized modules
- Deprecated inconsistent guard patterns and manual cookie handling

📦 Compatibility:
- Requires Node.js >= 20
- Designed for NestJS-based microservices
- Fully compatible with:
  - @omnixys/auth (identity & JWT handling)
  - @omnixys/context (request context propagation)
  - @omnixys/cache (Valkey for rate limiting & risk memory)
  - @omnixys/observability (security event tracing)

📚 Notes:
This release establishes the enterprise-grade security foundation for all Omnixys services,
enabling zero-trust enforcement, secure session handling, and extensible security mechanisms
for modern distributed architectures.

### Release

* **Release:** 1.0.0 [skip ci] ([](https://github.com/omnixys/security/commit/21fad3157cdedaa99efc8b228a73231e60d789b8))

### Security

* **Security:**  zero-trust security, encryption & policy enforcement ([](https://github.com/omnixys/security/commit/476887bf302f83e111b8355f91f06ad6bbfd4a3a))
* **Security:**  zero-trust security, encryption & policy enforcement ([](https://github.com/omnixys/security/commit/5db3c4c012b61da737d5865d9a5c4f8e7604b3d4))
* **Security:**  zero-trust security, encryption & policy enforcement ([](https://github.com/omnixys/security/commit/62e7891e3c837834f0d558d1f0594c7481e69281))

### U

* **U:** u ([](https://github.com/omnixys/security/commit/0958470937acd6a6a259aea9c2bc5bb1eb530442))

### Update

* **Update:** update ([](https://github.com/omnixys/security/commit/7ba708d1e88d8cee11a8b7d3b7e91d919bb2ae74))

## 1.0.0 (2026-04-15)

### ⚠ BREAKING CHANGE

* **Security:** Complete redesign of the security layer with zero-trust principles, unified policy enforcement,
and integration with @omnixys/auth and @omnixys/context.
Legacy security utilities and inconsistent implementations have been removed.

✨ Features:
- Zero-Trust security architecture for distributed microservices
- Seamless integration with @omnixys/auth (identity) and @omnixys/context (request state)
- JWE encryption module:
  - Secure payload encryption/decryption (AES-GCM)
  - Keyring support with multiple KIDs and rotation strategies
- Secure session handling:
  - Cookie-based sessions (HTTP-only, secure, same-site)
  - Stateless + hybrid session strategies
- Role-Based Access Control (RBAC):
  - RoleGuard with fine-grained access checks
  - Context-aware role resolution (actorId, tenantId)
- Rate limiting:
  - In-memory and distributed (Valkey) stores
  - Flexible throttling strategies (IP, user, device)
- Hashing utilities:
  - HMAC-based signing and verification
  - Secure hashing helpers for tokens and secrets
- CookieService:
  - Standardized cookie creation, parsing, and security flags
- Security guards:
  - ZeroTrustGuard
  - CookieAuthGuard
  - RoleGuard
- Device-aware security primitives (foundation for device trust & step-up auth)

⚙️ Improvements:
- Unified security APIs across all Omnixys services
- Strong typing for all security-related operations
- Reduced duplication of auth + security logic
- Consistent handling of cookies, tokens, and encryption
- Improved extensibility for advanced security flows (MFA, WebAuthn)

🧱 Architecture:
- Modular NestJS dynamic module (SecurityModule.forRoot / forRootAsync)
- Clear separation of concerns:
  - Authentication → @omnixys/auth
  - Enforcement → @omnixys/security
- Pluggable stores (in-memory, Valkey) for rate limiting and risk memory
- Key management abstraction (JWE, HMAC)

🛑 Removed / Changed:
- Removed legacy security helpers and duplicated implementations
- Replaced ad-hoc encryption and hashing with standardized modules
- Deprecated inconsistent guard patterns and manual cookie handling

📦 Compatibility:
- Requires Node.js >= 20
- Designed for NestJS-based microservices
- Fully compatible with:
  - @omnixys/auth (identity & JWT handling)
  - @omnixys/context (request context propagation)
  - @omnixys/cache (Valkey for rate limiting & risk memory)
  - @omnixys/observability (security event tracing)

📚 Notes:
This release establishes the enterprise-grade security foundation for all Omnixys services,
enabling zero-trust enforcement, secure session handling, and extensible security mechanisms
for modern distributed architectures.
* **Security:** Complete redesign of the security layer with zero-trust principles, unified policy enforcement,
and integration with @omnixys/auth and @omnixys/context.
Legacy security utilities and inconsistent implementations have been removed.

✨ Features:
- Zero-Trust security architecture for distributed microservices
- Seamless integration with @omnixys/auth (identity) and @omnixys/context (request state)
- JWE encryption module:
  - Secure payload encryption/decryption (AES-GCM)
  - Keyring support with multiple KIDs and rotation strategies
- Secure session handling:
  - Cookie-based sessions (HTTP-only, secure, same-site)
  - Stateless + hybrid session strategies
- Role-Based Access Control (RBAC):
  - RoleGuard with fine-grained access checks
  - Context-aware role resolution (actorId, tenantId)
- Rate limiting:
  - In-memory and distributed (Valkey) stores
  - Flexible throttling strategies (IP, user, device)
- Hashing utilities:
  - HMAC-based signing and verification
  - Secure hashing helpers for tokens and secrets
- CookieService:
  - Standardized cookie creation, parsing, and security flags
- Security guards:
  - ZeroTrustGuard
  - CookieAuthGuard
  - RoleGuard
- Device-aware security primitives (foundation for device trust & step-up auth)

⚙️ Improvements:
- Unified security APIs across all Omnixys services
- Strong typing for all security-related operations
- Reduced duplication of auth + security logic
- Consistent handling of cookies, tokens, and encryption
- Improved extensibility for advanced security flows (MFA, WebAuthn)

🧱 Architecture:
- Modular NestJS dynamic module (SecurityModule.forRoot / forRootAsync)
- Clear separation of concerns:
  - Authentication → @omnixys/auth
  - Enforcement → @omnixys/security
- Pluggable stores (in-memory, Valkey) for rate limiting and risk memory
- Key management abstraction (JWE, HMAC)

🛑 Removed / Changed:
- Removed legacy security helpers and duplicated implementations
- Replaced ad-hoc encryption and hashing with standardized modules
- Deprecated inconsistent guard patterns and manual cookie handling

📦 Compatibility:
- Requires Node.js >= 20
- Designed for NestJS-based microservices
- Fully compatible with:
  - @omnixys/auth (identity & JWT handling)
  - @omnixys/context (request context propagation)
  - @omnixys/cache (Valkey for rate limiting & risk memory)
  - @omnixys/observability (security event tracing)

📚 Notes:
This release establishes the enterprise-grade security foundation for all Omnixys services,
enabling zero-trust enforcement, secure session handling, and extensible security mechanisms
for modern distributed architectures.
* **Security:** Complete redesign of the security layer with zero-trust principles, unified policy enforcement,
and integration with @omnixys/auth and @omnixys/context.
Legacy security utilities and inconsistent implementations have been removed.

✨ Features:
- Zero-Trust security architecture for distributed microservices
- Seamless integration with @omnixys/auth (identity) and @omnixys/context (request state)
- JWE encryption module:
  - Secure payload encryption/decryption (AES-GCM)
  - Keyring support with multiple KIDs and rotation strategies
- Secure session handling:
  - Cookie-based sessions (HTTP-only, secure, same-site)
  - Stateless + hybrid session strategies
- Role-Based Access Control (RBAC):
  - RoleGuard with fine-grained access checks
  - Context-aware role resolution (actorId, tenantId)
- Rate limiting:
  - In-memory and distributed (Valkey) stores
  - Flexible throttling strategies (IP, user, device)
- Hashing utilities:
  - HMAC-based signing and verification
  - Secure hashing helpers for tokens and secrets
- CookieService:
  - Standardized cookie creation, parsing, and security flags
- Security guards:
  - ZeroTrustGuard
  - CookieAuthGuard
  - RoleGuard
- Device-aware security primitives (foundation for device trust & step-up auth)

⚙️ Improvements:
- Unified security APIs across all Omnixys services
- Strong typing for all security-related operations
- Reduced duplication of auth + security logic
- Consistent handling of cookies, tokens, and encryption
- Improved extensibility for advanced security flows (MFA, WebAuthn)

🧱 Architecture:
- Modular NestJS dynamic module (SecurityModule.forRoot / forRootAsync)
- Clear separation of concerns:
  - Authentication → @omnixys/auth
  - Enforcement → @omnixys/security
- Pluggable stores (in-memory, Valkey) for rate limiting and risk memory
- Key management abstraction (JWE, HMAC)

🛑 Removed / Changed:
- Removed legacy security helpers and duplicated implementations
- Replaced ad-hoc encryption and hashing with standardized modules
- Deprecated inconsistent guard patterns and manual cookie handling

📦 Compatibility:
- Requires Node.js >= 20
- Designed for NestJS-based microservices
- Fully compatible with:
  - @omnixys/auth (identity & JWT handling)
  - @omnixys/context (request context propagation)
  - @omnixys/cache (Valkey for rate limiting & risk memory)
  - @omnixys/observability (security event tracing)

📚 Notes:
This release establishes the enterprise-grade security foundation for all Omnixys services,
enabling zero-trust enforcement, secure session handling, and extensible security mechanisms
for modern distributed architectures.

### Security

* **Security:**  zero-trust security, encryption & policy enforcement ([](https://github.com/omnixys/security/commit/476887bf302f83e111b8355f91f06ad6bbfd4a3a))
* **Security:**  zero-trust security, encryption & policy enforcement ([](https://github.com/omnixys/security/commit/5db3c4c012b61da737d5865d9a5c4f8e7604b3d4))
* **Security:**  zero-trust security, encryption & policy enforcement ([](https://github.com/omnixys/security/commit/62e7891e3c837834f0d558d1f0594c7481e69281))
