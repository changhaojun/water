package login;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.jfinal.aop.Before;
import com.jfinal.aop.Clear;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

import common.AuthInterceptor;
import common.Constants;

public class LoginController extends Controller{
	private static Logger log=Logger.getLogger(LoginController.class);
	private static LoginService loginService=new LoginService();
	@Clear(AuthInterceptor.class)
	public void index(){
		render("login.html");
	}
	
	/**
	 * 登录操作
	 */
	@Clear(AuthInterceptor.class)
	@Before(LoginValidator.class)
	public void login(){
		//登录用户信息保存到session中
		String username=getPara("username");
		LoginService loginService=new LoginService();
		Record user=loginService.getUser(username);
		setSessionAttr(Constants.SESSION_USER,user);
		//定向到系统首页
		redirect("/frame");
	}
	
	public void logout(){
		HttpSession session=getSession();
		if(session!=null){
			session.removeAttribute(Constants.SESSION_USER);
			session.removeAttribute(Constants.SESSION_COMPANY);
			session.removeAttribute(Constants.SESSION_ACCESSTOKEN);
			session.removeAttribute(Constants.SESSION_REFRESHTOKEN);
		}
		render("login.html");
	}
}
