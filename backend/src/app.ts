/**
 * サーバー起動スクリプト
 *
 * このスクリプトは、Expressを使用して基本的なHTTPサーバーを起動します。
 * JSONリクエストボディの解析ミドルウェアを設定し、指定されたポートで待ち受けます。
 *
 * 使用技術:
 * - Express（Webフレームワーク）
 * - Node.js httpモジュール
 *
 *  Date : 2025/04/01 - 2025/07/31
 *  Author :
 */

// Expressライブラリをインポート（Node.jsのWebアプリケーションフレームワーク）
import express from 'express';

// httpモジュールをインポート（Node.jsの標準モジュール、HTTPサーバーを作成するために使用）
import http from 'http';
import { routing1 } from './route/router1.js';

// import

// expressアプリケーションのインスタンスを作成
const app = express();

// HTTPサーバーをexpressアプリを基に作成
const server = http.createServer(app);

// 受信するリクエストのボディをJSONとして自動的に解析するミドルウェアを追加
// app.use(express.json());

// サーバーがリッスンするポート番号を指定
const port = 8000;

console.log('aaaa');

routing1(3);

// 指定したポートでHTTPサーバーを起動し、起動成功時にメッセージを出力
// server.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// websocket
