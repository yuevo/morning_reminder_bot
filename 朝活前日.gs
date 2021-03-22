   // 17行目のシート名を今月のシートに修正、63行目の第4引数を今月の最終日に修正


　　function beforeRemind(){
    
    // 今日の日付をDateオブジェクトで取得
    let today = new Date();
    // 今日が何年なのか取得
    let this_year = today.getFullYear();
    // 今日が何月なのか取得（01月のように、日付を検索するために必ず２桁で取得する必要があるので下記の記述）
    let this_month = ("0"+(today.getMonth() + 1)).slice(-2);
    // 今日が何日なのか取得
    let this_day = ("0"+(today.getDate() + 1)).slice(-2);
    // 今日の日付を"yyyy/MM/dd"の形で再生成
    let search_today = this_year + '/' + this_month + '/' + this_day;
    // 今月のシートを取得する
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('3月');
    // 今日の日付がどこのセルにあるのかを検索するメソッドを発火
    let row = get_row_(search_today, sheet);
     
    
    
    // 今日の日付から参加者リストを取得
    let join_lists = sheet.getSheetValues(3, 10 + row, 14, 1);
    // メンバー全員分のユーザIDを取得
    let members = sheet.getSheetValues(3, 4, 13, 1);
    // reminder用配列
    let reminder = [];
    
    join_lists.forEach( function(list, i) {
      if (list == "両方参加" || list == "朝活参加") {
        Utilities.sleep(1000);
        var member = members[i];
        reminder.push(member);
      } else {
        return false;
      };
    });
     
    let meet_url = "meet.google.com/kju-xjck-tmq"
    
    sendHttpPost_('こんばんわ！朝活リマインダーbotです:sunny:\
                  \n' + reminder +'\
                  \n明日の朝活参加者リストです！\
                  \n参加の方は、明朝に備えて早めに寝ましょう〜','朝活リマインダーbot',':chicken:');

     
   };
   
   // 今日の日付がどこのセルにあるのかを検索するメソッド
   function get_row_(key, sheet){
    // 今月は何日から何日まであるか調べてくるメソッドを発火し、返り値をarray変数を代入
    var array = get_array_(sheet, key);
    // 今日の日付がarrayの何番目にあるか調べる
    var row = array.indexOf(key);
    // その結果を返り値rowで返す
    return row;
   }
   
   // 今月は何日から何日まであるか調べてくるメソッド
   function get_array_(sheet, key) {
     // 今月の日付を全て取得
     var days = sheet.getSheetValues(2, 10, 1, 31);
     // 配列の準備
     var array = [];
     // 今月の全日付を１つ１つarray配列に代入する
     days[0].forEach( function(day, i) {
       // 処理を待つためにスリープ1秒
       Utilities.sleep(1000);
       // GASで取り扱いできるように日付を整形
       var day_format = Utilities.formatDate(day, 'Asia/Tokyo', 'yyyy/MM/dd');
       // array配列に日付を代入
       array.push(day_format);
     });
     // 今月の日付が配列に収まったら返り値として返す
     return array;
   }


  // ポストするための記述
  function sendHttpPost_(message, username, icon)　{
   let jsonData =　{
     "channel" : postChannel,
     "username" : username,
     "icon_emoji": icon,
     "text" : message
   };
   let payload = JSON.stringify(jsonData);
   let options =　{
     "method" : "post",
     "contentType" : "application/json",
     "payload" : payload
   };
   UrlFetchApp.fetch(postUrl, options);
  }
