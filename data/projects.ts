import type { Project } from "../types/portfolio";
import type { EvidenceId } from "./evidence";

export const projects = [
  {
    "id": "R01",
    "name": "Multi-Vendor-E-Commerce",
    "title": "複数店舗の商品・注文管理",
    "description": {
      "text": "店舗・商品管理、注文作成、決済連携を扱うECアプリ。ロールと所有者の確認、注文処理の構成を紹介します。",
      "evidenceIds": [
        "R01-T01",
        "R01-A01",
        "R01-A02",
        "R01-F01",
        "R01-F02",
        "R01-F03"
      ]
    },
    "githubUrl": "https://github.com/myoshi2891/Multi-Vendor-E-Commerce",
    "order": 1,
    "type": "featured",
    "slug": "multi-vendor-e-commerce",
    "technologies": [
      {
        "text": "Next.js",
        "evidenceIds": [
          "R01-T01"
        ]
      },
      {
        "text": "TypeScript",
        "evidenceIds": [
          "R01-T01"
        ]
      },
      {
        "text": "Prisma",
        "evidenceIds": [
          "R01-A01"
        ]
      }
    ],
    "highlights": [
      {
        "text": "所有者確認と注文トランザクション",
        "evidenceIds": [
          "R01-T01",
          "R01-A01",
          "R01-A02",
          "R01-F01",
          "R01-F02",
          "R01-F03"
        ]
      }
    ]
  },
  {
    "id": "R06",
    "name": "Comparison-of-LLMs",
    "title": "LLM料金の収集と費用計算",
    "description": {
      "text": "Pythonによる料金データの収集と、入力・出力トークン数や期間に応じた費用計算を組み合わせたWebツールです。",
      "evidenceIds": [
        "R06-T01",
        "R06-A01",
        "R06-F01",
        "R06-F02"
      ]
    },
    "githubUrl": "https://github.com/myoshi2891/Comparison-of-LLMs",
    "order": 2,
    "type": "featured",
    "slug": "comparison-of-llms",
    "technologies": [
      {
        "text": "Python",
        "evidenceIds": [
          "R06-T01"
        ]
      },
      {
        "text": "Next.js",
        "evidenceIds": [
          "R06-T01"
        ]
      },
      {
        "text": "TypeScript",
        "evidenceIds": [
          "R06-T01"
        ]
      },
      {
        "text": "Pydantic / Zod",
        "evidenceIds": [
          "R06-T01",
          "R06-A01"
        ]
      }
    ],
    "highlights": [
      {
        "text": "収集データとWebの検証境界",
        "evidenceIds": [
          "R06-T01",
          "R06-A01",
          "R06-F01",
          "R06-F02"
        ]
      }
    ]
  },
  {
    "id": "R12",
    "name": "Medical-Studies",
    "title": "頭痛医療教育・記録プラットフォーム",
    "description": {
      "text": "頭痛の教育コンテンツ、3D解剖アトラス、患者報告アウトカム（PROM）の自己記録を統合したWebアプリの設計と公開上の制約を紹介します。",
      "evidenceIds": [
        "R12-T01",
        "R12-A01",
        "R12-F01",
        "R12-F02"
      ]
    },
    "githubUrl": "https://github.com/myoshi2891/Medical-Studies",
    "order": 3,
    "type": "featured",
    "slug": "medical-studies",
    "technologies": [
      {
        "text": "Next.js",
        "evidenceIds": [
          "R12-T01"
        ]
      },
      {
        "text": "TypeScript",
        "evidenceIds": [
          "R12-T01"
        ]
      },
      {
        "text": "React",
        "evidenceIds": [
          "R12-T01"
        ]
      }
    ],
    "highlights": [
      {
        "text": "計算・保存・出力の責務分割",
        "evidenceIds": [
          "R12-T01",
          "R12-A01",
          "R12-F01",
          "R12-F02"
        ]
      }
    ]
  },
  {
    "id": "R02",
    "name": "The-Wild-Oasis-For-Admin",
    "title": "宿泊施設の管理アプリ",
    "description": {
      "text": "ホテルスタッフが客室・予約・ゲスト情報、チェックイン／アウト、売上と稼働率を一元管理する業務ダッシュボードです。",
      "evidenceIds": [
        "R02-T01",
        "R02-A01",
        "R02-F01",
        "R02-F02"
      ]
    },
    "githubUrl": "https://github.com/myoshi2891/The-Wild-Oasis-For-Admin",
    "order": 4,
    "type": "featured",
    "slug": "the-wild-oasis-for-admin",
    "technologies": [
      {
        "text": "React",
        "evidenceIds": [
          "R02-T01"
        ]
      },
      {
        "text": "TypeScript",
        "evidenceIds": [
          "R02-T01"
        ]
      },
      {
        "text": "Supabase",
        "evidenceIds": [
          "R02-A01"
        ]
      },
      {
        "text": "TanStack Query",
        "evidenceIds": [
          "R02-T01",
          "R02-A01"
        ]
      }
    ],
    "highlights": [
      {
        "text": "管理操作からデータ保存まで",
        "evidenceIds": [
          "R02-T01",
          "R02-A01",
          "R02-F01",
          "R02-F02"
        ]
      }
    ]
  },
  {
    "id": "R04",
    "name": "AirbnbCloneApp",
    "title": "物件検索と予約",
    "description": {
      "text": "物件の登録・検索、予約、お気に入り、レビューを扱うWebアプリです。",
      "evidenceIds": [
        "R04-A01",
        "R04-F01",
        "R04-F02"
      ]
    },
    "githubUrl": "https://github.com/myoshi2891/AirbnbCloneApp",
    "order": 1,
    "type": "secondary",
    "technologies": [],
    "highlights": [
      {
        "text": "予約作成のトランザクションと決済連携コード。",
        "evidenceIds": [
          "R04-A01",
          "R04-F01",
          "R04-F02"
        ]
      }
    ]
  },
  {
    "id": "R03",
    "name": "The-Wild-Oasis-For-User",
    "title": "ゲスト向け宿泊予約",
    "description": {
      "text": "客室の予約作成・変更・削除を扱うWebアプリ。予約操作時の所有者確認を実装しています。",
      "evidenceIds": [
        "R03-A01",
        "R03-F01"
      ]
    },
    "githubUrl": "https://github.com/myoshi2891/The-Wild-Oasis-For-User",
    "order": 2,
    "type": "secondary",
    "technologies": [],
    "highlights": [
      {
        "text": "ページ・Server Actions・データ処理の分割。",
        "evidenceIds": [
          "R03-A01",
          "R03-F01"
        ]
      }
    ]
  },
  {
    "id": "R05",
    "name": "Next-Store",
    "title": "商品販売とカート管理",
    "description": {
      "text": "商品検索、レビュー、お気に入り、カート更新、注文作成を扱うオンラインストアです。",
      "evidenceIds": [
        "R05-A01",
        "R05-F01"
      ]
    },
    "githubUrl": "https://github.com/myoshi2891/Next-Store",
    "order": 3,
    "type": "secondary",
    "technologies": [],
    "highlights": [
      {
        "text": "Server ActionsとDB処理。",
        "evidenceIds": [
          "R05-A01",
          "R05-F01"
        ]
      }
    ]
  }
] as const satisfies readonly Project<EvidenceId>[];

export type FeaturedSlug = Extract<(typeof projects)[number], { type: "featured" }>["slug"];
