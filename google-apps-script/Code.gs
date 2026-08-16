/**
 * Todoリスト管理アプリ用のGoogle Apps Scriptコードです。
 *
 * 【セットアップ手順】
 * 1. Todoを保存するGoogleスプレッドシートを新規作成する
 * 2. シート下部のタブを「Todos」という名前にする（1枚目のシートでOK）
 * 3. メニューの「拡張機能」→「Apps Script」を開く
 * 4. デフォルトで開かれるコード.gsの中身をすべて削除し、このファイルの内容を貼り付ける
 * 5. 画面右上の「デプロイ」→「新しいデプロイ」を選択
 *    - 種類の選択で「ウェブアプリ」を選ぶ
 *    - 「次のユーザーとして実行」：自分
 *    - 「アクセスできるユーザー」：全員
 * 6. デプロイ後に表示される「ウェブアプリのURL」をコピーする
 * 7. プロジェクトの.envファイルのVITE_GAS_API_URLにそのURLを設定する
 *
 * ※スプレッドシートの内容やシート名を変更した場合、再デプロイは不要ですが、
 *   コードを修正した場合は「デプロイを管理」から新しいバージョンを反映してください。
 */

var SHEET_NAME = 'Todos';
var HEADER = ['id', 'title', 'content', 'dueDate'];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER);
  }
  return sheet;
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function formatDueDate_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return Utilities.formatDate(value, 'GMT+9', 'yyyy-MM-dd');
  }
  return value || '';
}

// GET: 一覧取得
function doGet() {
  var sheet = getSheet_();
  var rows = sheet.getDataRange().getValues();
  var todos = [];

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    if (!row[0]) continue;
    todos.push({
      id: String(row[0]),
      title: String(row[1] || ''),
      content: String(row[2] || ''),
      dueDate: formatDueDate_(row[3]),
    });
  }

  return jsonResponse_(todos);
}

// POST: 新規登録・更新（idの有無で判定）
function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse_({ error: 'リクエストの形式が正しくありません。' });
  }

  var title = body.title ? String(body.title).trim() : '';
  var content = body.content ? String(body.content) : '';
  var dueDate = body.dueDate ? String(body.dueDate) : '';

  if (!title) {
    return jsonResponse_({ error: 'タイトルは必須です。' });
  }

  var sheet = getSheet_();

  if (body.id) {
    var rowIndex = findRowById_(sheet, String(body.id));
    if (rowIndex === -1) {
      return jsonResponse_({ error: '指定されたIDのTodoが見つかりません。' });
    }
    sheet.getRange(rowIndex, 2, 1, 3).setValues([[title, content, dueDate]]);
    return jsonResponse_({ id: String(body.id), title: title, content: content, dueDate: dueDate });
  }

  var newId = Utilities.getUuid();
  sheet.appendRow([newId, title, content, dueDate]);
  return jsonResponse_({ id: newId, title: title, content: content, dueDate: dueDate });
}

function findRowById_(sheet, id) {
  var ids = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 0), 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === id) {
      return i + 2;
    }
  }
  return -1;
}
