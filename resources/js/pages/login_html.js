
$(document).ready(function(){
        $('#submit').click(function () {
            $("#error_m").html("");
            if ($("#username").val() == "") {
                // errorMsg = "请您输入用户名！";

                $("#error_m").html("请您输入用户名！");

            }else if ($("#username").val().substring(0, $("#username").val().indexOf('@')) == ""){
                // errorMsg = "\n用户名格式不正确！例：xxx@develop";
                $("#error_m").html("\n用户名格式不正确！例：xxx@develop");
                return false;
            } else if ($("#password").val() == "") {
                // errorMsg = "\n请您输入密码！";
                $("#error_m").html("\n请您输入密码！");
                // $("#error_m").next().hide();
                return false;
            }
            var account=$("#username").val().split('@')[0];
            var projectName=$("#username").val().split('@')[1];
            var pwd=$('#password').val();
            // alert(projectName);
            $.post(
                CONFIG.requestURL+'/backend_mgt/v2/logon/',
                JSON.stringify({
                    "action": "GetToken",
                    "projectName": projectName,
                    "account": account,
                    "password": pwd
                }),
                function (data) {
                    var resault = JSON.parse(data);
                    var status=resault.rescode;
                    var err=resault['errInfo'];
                    if (status==200) {
                        cookies("project_name",projectName);
                        cookies('account',account);
                        cookies('token',resault.token);
                        window.location.href=CONFIG.requestURL+'/index.html'
                    }else{
                        // window.location.href=CONFIG.requestURL+'/ims3/'
                        $("#error_m").html(err);

                    }

                });

        })
    });


function cookies(projectname,value){
    if(getCookie(projectname) == undefined){
        setCookie(projectname,value);
    }else if(getCookie(projectname) != ""){
        setCookie(projectname,value);
    }
}


//
//
//
// function usernameChenge(value) {
//     $("#j_username").attr("value", value.substring(0, value.indexOf('@')));
//     $("#j_project_name").attr("value", value.substring(value.lastIndexOf('@') + 1));
// }
//
// //校验是否为空
//
//

//
//
// //设置cookie
function setCookie(name,value,days){
    //var exp=new Date();
    //exp.setTime(exp.getTime() + days*24*60*60*1000);
    //var arr=document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    document.cookie=name+"="+escape(value);
}
function getCookie(name){
	var arr=document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
	if(arr!=null){
    	return unescape(arr[2]);
    	return null;
 	}
}

$(function(){
	if(getCookie("project_name") != undefined){
		auto($("#username"));
	}
});

//用户名自动补全
function auto(selector){
    var elt = selector;
    var autoComplete,autoLi;
    var strHtml = [];
    strHtml.push('<div class="AutoComplete" id="AutoComplete">');
    strHtml.push('    <ul class="AutoComplete_ul">');
    strHtml.push('        <li hz="@'+getCookie("project_name")+'"></li>');
    strHtml.push('    </ul>');
    strHtml.push('</div>');

    $('body').append(strHtml.join(''));

    autoComplete = $('#AutoComplete');
    autoComplete.data('elt',elt);
    autoLi = autoComplete.find('li:not(.AutoComplete_title)');
    autoLi.mouseover(function(){
        $(this).siblings().filter('.hover').removeClass('hover');
        $(this).addClass('hover');
    }).mouseout(function(){
        $(this).removeClass('hover');
    }).mousedown(function(){
        autoComplete.data('elt').val($(this).text()).change();
        autoComplete.hide();
    });
    //用户名补全+翻动
    elt.keyup(function(e){
        if(/13|38|40|116/.test(e.keyCode) || this.value == ''){
            return false;
        }
        var username = this.value;
        if(username.indexOf('@') == -1){
            autoComplete.hide();
            return false;
        }
        autoLi.each(function(){
            this.innerHTML = username.replace(/\@+.*/,'') + $(this).attr('hz');
            if(this.innerHTML.indexOf(username) >= 0){
                $(this).show();
            }else{
                $(this).hide();
            }
        }).filter('.hover').removeClass('hover');
        autoComplete.show().css({
            left: $(this).offset().left,
            top: $(this).offset().top + $(this).outerHeight(true) - 1,
            position: 'absolute',
            zIndex: '99999'
        });
        if(autoLi.filter(':visible').length == 0){
            autoComplete.hide();
        }else{
            autoLi.filter(':visible').eq(0).addClass('hover');
        }
    }).keydown(function(e){
        if(e.keyCode == 38){ //上
            autoLi.filter('.hover').prev().not('.AutoComplete_title').addClass('hover').next().removeClass('hover');
        }else if(e.keyCode == 40){ //下
            autoLi.filter('.hover').next().addClass('hover').prev().removeClass('hover');
        }else if(e.keyCode == 13){ //Enter
            autoLi.filter('.hover').mousedown();
            e.preventDefault();    //如有表单，阻止表单提交
        }
    }).focus(function(){
        autoComplete.data('elt',$(this));
    }).blur(function(){
        autoComplete.hide();
    });
}
