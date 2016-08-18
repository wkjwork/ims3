<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
	<title>CLEAR IMS 3.0</title>
    <link rel="shortcut icon" href="resources/favicon.ico">
	<!-- Bootstrap 3.3.6 -->
	<link rel="stylesheet" href="resources/bootstrap/css/bootstrap.min.css">
	<!-- Theme style -->
	<link rel="stylesheet" href="resources/dist/css/AdminLTE.css">
	<link rel="stylesheet" href="resources/css/common/base.css">
	<script type='text/javascript' src="resources/plugins/jQuery/jQuery-2.2.0.min.js"></script>
	<script type='text/javascript' src="resources/js/config.js"></script>
	<script type='text/javascript' src="resources/js/pages/login.js"></script>
    <!--dynamic background-->
    <link rel="stylesheet" href="resources/css/common/dynamicBG.css">
    <script type='text/javascript' src="resources/js/common/dynamicBG.js"></script>
    
</head>
<body class="hold-transition login-page">

<div class="dynamicBG-wrapper">
    <div class="dynamicBG"></div>
    <div class="dynamicBG"></div>
    <div class="dynamicBG"></div>
</div>


<div class="login-box" style="position: absolute; margin-left: -180px; left: 50%; margin-top: 7%;">

    <div class="login-logo" style="color: white; margin-bottom: 12px;">
        <a style="cursor:default;color: white; font-size: 36px;"><b>CLEAR</b>&nbsp;信息发布系统</a>
    </div>
    <!-- /.login-logo -->
    <div class="login-box-body" style="background-color: rgba(255,255,255,.85)">
        <!--<p class="login-box-msg">Sign in to start your session</p>-->
        <h3 style="margin-bottom: 30px; text-align: center;">登录 Clear Cloud 账户</h3>
        <form method='POST' action='<c:url value='/j_spring_security_check' />' onsubmit="return inputCheck()">
            <div class="form-group has-feedback">
                <input id="l_username" type="text" class="form-control" placeholder="账号" onchange="usernameChenge(value)">
                <ul class="l_userlist">
                    <!--<p></p>-->
                </ul>
                <span class="glyphicon glyphicon-user form-control-feedback"></span>
            </div>
            <!-- <small style="font-size: 12px; margin-bottom: 4px; line-height: 20px; position: relative; top: -8px;">账号格式为 <strong>用户名@项目名</strong>，如 root@cleartv </small> -->
            <div class="form-group has-feedback">
                <input id="l_password" name="j_password" type="password" class="form-control" placeholder="密码">
                <span class="glyphicon glyphicon-lock form-control-feedback"></span>
            </div>
            <!-- <small style="font-size: 12px; margin-bottom: 4px; line-height: 50px; position: relative; top: -21px;">如果忘记密码，可以联系管理员重置 </small> -->
			<input id="j_username" name="j_username"  type="text" style="display: none;" />
			<input id="j_project_name" name="j_project_name"  type="text" style="display: none;" />
            <div class="row">
                <!-- /.col -->
                <div style="padding: 0px 15px; text-align: center;">
                    <input id="l_submit" type="submit" class="btn btn-primary btn-block btn-flat" value="登&nbsp;&nbsp;&nbsp;录">
                    <span id="error_m"></span>
                    <c:if test='${not empty param.error}'>
						<font color='#3c8dbc'>
                            您输入的用户名或密码错误！
						</font>
					</c:if>
                </div>
                <!-- /.col -->
            </div>
        </form>
		
    </div>
    <!-- /.login-box-body -->
</div>
<!-- /.login-box -->
<div id="l_version" style="color: white"><b>Version</b> 3.0.1</div>
</body>
</html>