import type { Study } from "../types/portfolio";
import type { EvidenceId } from "./evidence";

export const studies = [
  {
    "id": "R08",
    "name": "Software-Design-and-Architecture",
    "title": "ソフトウェア設計とアーキテクチャ",
    "description": {
      "text": "設計・アーキテクチャの学習資料を、カテゴリからたどるガイドです。",
      "evidenceIds": [
        "R08-A01",
        "R08-F01"
      ]
    },
    "githubUrl": "https://github.com/myoshi2891/Software-Design-and-Architecture",
    "order": 1,
    "type": "study",
    "topics": [
      "ソフトウェア設計とアーキテクチャ"
    ],
    "implementationNotes": [
      {
        "text": "資料とWebアプリを併置し、公開済み・準備中をカタログで管理。",
        "evidenceIds": [
          "R08-A01",
          "R08-F01"
        ]
      }
    ]
  },
  {
    "id": "R07",
    "name": "Quality-Assurance-Studies",
    "title": "テストと品質保証",
    "description": {
      "text": "品質保証の学習ガイドを、検索とカテゴリ別の一覧から探せます。",
      "evidenceIds": [
        "R07-A01",
        "R07-F01"
      ]
    },
    "githubUrl": "https://github.com/myoshi2891/Quality-Assurance-Studies",
    "order": 2,
    "type": "study",
    "topics": [
      "テストと品質保証"
    ],
    "implementationNotes": [
      {
        "text": "入力クエリによるガイド絞り込みとカテゴリ表示。",
        "evidenceIds": [
          "R07-A01",
          "R07-F01"
        ]
      }
    ]
  },
  {
    "id": "R11",
    "name": "Security_Studies",
    "title": "セキュリティ",
    "description": {
      "text": "セキュリティの学習資料を、文書と検索から参照するサイトです。",
      "evidenceIds": [
        "R11-A01",
        "R11-F01"
      ]
    },
    "githubUrl": "https://github.com/myoshi2891/Security_Studies",
    "order": 3,
    "type": "study",
    "topics": [
      "セキュリティ"
    ],
    "implementationNotes": [
      {
        "text": "MDX文書から索引を生成し、静的JSONを使って検索。",
        "evidenceIds": [
          "R11-A01",
          "R11-F01"
        ]
      }
    ]
  },
  {
    "id": "R10",
    "name": "Cloud-Infrastructure-and-Network-Studies",
    "title": "クラウドとネットワーク",
    "description": {
      "text": "クラウド・ネットワークの試験カタログから、学習ガイドをたどれます。",
      "evidenceIds": [
        "R10-A01",
        "R10-F01"
      ]
    },
    "githubUrl": "https://github.com/myoshi2891/Cloud-Infrastructure-and-Network-Studies",
    "order": 4,
    "type": "study",
    "topics": [
      "クラウドとネットワーク"
    ],
    "implementationNotes": [
      {
        "text": "提供元別のカタログ表示と閲覧履歴の保存。",
        "evidenceIds": [
          "R10-A01",
          "R10-F01"
        ]
      }
    ]
  },
  {
    "id": "R13",
    "name": "Algorithm-DataStructures-Math-SQL",
    "title": "アルゴリズム・データ構造・数学・SQL",
    "description": {
      "text": "基礎学習の資料とコード例をまとめたリポジトリです。",
      "evidenceIds": [
        "R13-A01",
        "R13-F01"
      ]
    },
    "githubUrl": "https://github.com/myoshi2891/Algorithm-DataStructures-Math-SQL",
    "order": 5,
    "type": "study",
    "topics": [
      "アルゴリズム・データ構造・数学・SQL"
    ],
    "implementationNotes": [
      {
        "text": "Pythonによる静的索引生成、検索、GCD／LCMのコード例。",
        "evidenceIds": [
          "R13-A01",
          "R13-F01"
        ]
      }
    ]
  },
  {
    "id": "R09",
    "name": "Management-Team-Building-Studies",
    "title": "マネジメントとチームビルディング",
    "description": {
      "text": "マネジメントの学習ガイドを、カタログと検索から参照できます。",
      "evidenceIds": [
        "R09-A01",
        "R09-F01"
      ]
    },
    "githubUrl": "https://github.com/myoshi2891/Management-Team-Building-Studies",
    "order": 6,
    "type": "study",
    "topics": [
      "マネジメントとチームビルディング"
    ],
    "implementationNotes": [
      {
        "text": "ガイドのカタログと検索を分離し、複数語の検索を実装。",
        "evidenceIds": [
          "R09-A01",
          "R09-F01"
        ]
      }
    ]
  }
] as const satisfies readonly Study<EvidenceId>[];
