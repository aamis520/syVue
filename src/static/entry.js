if(window.WebSocket != undefined) {
    //创建一个WebSocket，监听端口1740端口，这里必须是：ws，不能是http
    var connection = new WebSocket('wss://localhost:1740');
    console.log(connection.readyState);
     //握手协议成功以后，readyState就从0变为1，并触发open事件
    connection.onopen = function wsOpen (event) {
        console.log('Connected to: ' + event.currentTarget.URL);
        //连接建立后，客户端通过send方法向服务器端发送数据。
        connection.send('向客户端发送消息');
    };
    //监听
    connection.onmessage = function wsMessage (event) {
        console.log(event);
    };
    //关闭WebSocket连接，会触发close事件。
    connection.onclose = function wsClose () {
        console.log("Closed");
    };
    //出现错误
    connection.onerror = wsError;
    function wsError(event) {
        console.log("Error: " + event.data);
    }
}
//readyState : 0：正在连接、 1：连接成功、2：正在关闭、3：连接关闭。
