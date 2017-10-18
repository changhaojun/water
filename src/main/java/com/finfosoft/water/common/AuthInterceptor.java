package com.finfosoft.water.common;

import java.util.List;

import org.apache.log4j.Logger;

import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

public class AuthInterceptor implements Interceptor{

	private static Logger log = Logger.getLogger(AuthInterceptor.class);
	private static AuthService authService = new AuthService();
	@Override
	public void intercept(Invocation invoc) {
		// TODO Auto-generated method stub
		Controller controller = invoc.getController();

		log.info("获取用户请求的URI");
		String uri = invoc.getActionKey();

		log.info("获取登录session");
		String token = controller.getSessionAttr(Constants.SESSION_ACCESSTOKEN);
		
		log.info("获取登录session");
		Record user = controller.getSessionAttr(Constants.SESSION_USER);

		log.info("验证用户令牌");
		if (token==null) {
			log.info("令牌错误");
			controller.redirect("/");
			return;
		}
 
		log.info("验证用户登陆");
		if (!checkLogin(user)) {
			log.info("未登陆");
			controller.redirect("/");
			return;
		}
		
		log.info("验证页面权限");
		if (!checkPrivilege(user, uri)) {
			log.info("权限不足");
			controller.redirect("/");
			return;
		}
		
		invoc.invoke();
		
	}
	
	/**
	 * 验证用户是否登录过系统
	 * 
	 * @return
	 */
	private boolean checkLogin(Record user) {
		if (user == null) {
			return false;
		} else {
			return true;
		}
	}
	
	/**
	 * 验证页面权限
	 * 
	 * @param controller
	 * @return
	 */
	private boolean checkPrivilege(Record user, String url) {
		// 判断指定url是否需要进行鉴权
//		boolean ifAuth = authService.isAuthUrl(url);
//		if (!ifAuth) {
//			return true;
//		}
		// 检测用户是否有此url的访问权限
		System.err.println(url);
		List<Record> urls = (List<Record>) user.get("resources");
		if (urls.contains(url)) {
			log.debug("url auth passed");
			return true;
		} else {
			log.debug("url auth failed");
			return false;
		}
	}

}
