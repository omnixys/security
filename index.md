src/
├── index.ts
├── security.module.ts
├── security.constants.ts
├── types/
│   ├── index.ts
│   └── security.types.ts
├── auth/
│   ├── index.ts
│   ├── auth.module.ts
│   ├── jwt/
│   │   ├── index.ts
│   │   └── jwt.strategy.ts
│   ├── guards/
│   │   ├── index.ts
│   │   ├── cookie-auth.guard.ts
│   │   ├── header-auth.guard.ts
│   │   └── role.guard.ts
│   ├── decorators/
│   │   ├── index.ts
│   │   ├── current-user.decorator.ts
│   │   ├── public.decorator.ts
│   │   └── roles.decorator.ts
│   └── utils/
│       ├── index.ts
│       ├── extract-roles.util.ts
│       ├── role-filter.util.ts
│       └── token-extractor.util.ts
├── jwe/
│   ├── index.ts
│   ├── jwe.module.ts
│   ├── core/
│   │   ├── index.ts
│   │   ├── jwe.constants.ts
│   │   ├── jwe.service.ts
│   │   ├── key.provider.ts
│   │   ├── keyring.provider.ts
│   │   └── token.factory.ts
│   └── store/
│       ├── index.ts
│       ├── jwe-store.service.ts
│       └── store.interface.ts
├── session/
│   ├── index.ts
│   └── secure-session.service.ts
├── hash/
│   ├── index.ts
│   └── hash.service.ts
├── rate-limit/
│   ├── index.ts
│   └── rate-limit.service.ts
├── cookie/
│   ├── index.ts
│   └── cookie.service.ts