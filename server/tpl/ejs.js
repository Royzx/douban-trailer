module.exports = `
<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Koa Server HTML</title>
    <link href="https://cdn.bootcss.com/twitter-bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js"></script>
    <script src="https://cdn.bootcss.com/twitter-bootstrap/4.3.1/js/bootstrap.bundle.min.js"></script>
</head>
<body>
    <div class="container">
        <div class="row">
            <div class="col-md-8">
                <h1>Hi <%= you %></h1>
                <p>This is <%= me %></P>
            </div>
            <div class="col-md-4">
                <p>测试动态 EJS 模板引擎</p>
            </div>
        </div>
    </div>
</body>
</html>
`