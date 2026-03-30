module.exports = {
  reset_password: {
    subject: "Reset your FitTrack password",
    text: "Reset your password using this link: <%= URL %>?code=<%= CODE %>",
    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Password Reset</title>
<style>
  body {
    margin:0;
    padding:0;
    font-family: 'Open Sans', Arial, sans-serif;
    background:#F4F6F8;
  }

  .container{
    max-width:520px;
    margin:60px auto;
    background:#ffffff;
    border-radius:10px;
    padding:40px 35px;
    box-shadow:0 6px 16px rgba(0,0,0,0.08);
  }

  h2{
    margin-top:0;
    color:#111827;
  }

  p{
    font-size:14px;
    color:#374151;
    line-height:1.6;
  }

  .button{
    display:inline-block;
    padding:12px 22px;
    margin:25px 0;
    background:#6366F1;
    color:#ffffff !important;
    text-decoration:none;
    border-radius:6px;
    font-weight:600;
  }

  .footer{
    margin-top:30px;
    font-size:12px;
    color:#9CA3AF;
  }
</style>
</head>

<body>

<div class="container">

<h2>Password Reset</h2>

<p>Hello,</p>

<p>You requested to reset the password for your <strong>FitTrack</strong> account.</p>

<p>Click the button below to set a new password.</p>

<a class="button"
href="<%= URL %>?code=<%= CODE %>">
Reset Password
</a>

<p>If you did not request this, you can safely ignore this email.</p>

<p class="footer">
FitTrack • Your Personal Fitness Tracker
</p>

</div>

</body>
</html>
`
  }
}