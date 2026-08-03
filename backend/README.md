<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# backend

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

---

## 最初のライブラリ導入手順メモ

npm: backendコンテナ内。

```bash
# pj作成
npm i -D @nestjs/cli
nest new .
npm i class-validator class-transformer dotenv
# dotenvではなく@nestjs/configの`ConfigService`を使うのもアリ
# その場合、`npm i`で`dotenv`の代わりに`@nestjs/config`をインストール

# prisma導入
npm install @prisma/client @prisma/adapter-mariadb
npm install -D prisma

# .envとprisma/schema.prisma作成
npx prisma init
```

## 開発環境起動

```bash
# 立ち上げ
docker compose up --build -d
```

あるいはDevContainerで起動。

## 開発時のアクション

NestJS: backendコンテナ内。

```bash
# 開発サーバ起動（ホットリロード）
npm run start:dev

# アグリゲート追加時にリソース一式を生成
nest g resource <name>

# 個別生成
nest g module <name>
nest g controller <name>
nest g service <name>
nest g guard <name> # リクエストして良いかの確認。
nest g interceptor <name> # controller前後の処理。
nest g pipe <name> # controller直前の値チェック。

# ビルド
npm run build

# テスト実行
npm run test
```

Prisma: backendコンテナ内。

```bash
# DBの中身をブラウザで閲覧・編集。
npx prisma studio

# モデル更新後
npx prisma migrate dev --name <マイグレーション履歴名> # SQLの再生成とローカルDBへの変更反映。（add, change, remove,,,）
npx prisma generate # ts clientを再生成して型を最適化。

# スキーマの構文チェックだけする。
npx prisma validate

# スキーマをフォーマット
npx prisma format

# マイグレーション履歴をリセット（DB全削除->再適用）
npx prisma migrate reset

# ボリューム削除後のマイグレーションｓ
npx prisma migrate deploy
```

MySQL: databaseコンテナ内。

```bash
# ログイン
mysql -u root -p${MYSQL_ROOT_PASSWORD}

# 権限付与
GRANT ALL PRIVILEGES ON *.* TO '${MYSQL_USER}'@'%';
```

コンテナ直接でリセット。

```bash
mysql -u root -proot

use database

SELECT * FROM ir_sensor_values;
SELECT * FROM devices;

DELETE FROM ir_sensor_values;
DELETE FROM devices;

UPDATE devices SET collect_matrics = 1 WHERE id = 1;
```
