package com.finfosoft.water.login;

import java.io.Console;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSON;
import com.finfosoft.db.mongo.MongoKit;
import com.finfosoft.water.common.AuthInterceptor;
import com.finfosoft.water.common.Constants;
import com.jfinal.aop.Before;
import com.jfinal.aop.Clear;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;
import com.mongodb.DBObject;

public class LoginController extends Controller{
	private static Logger log=Logger.getLogger(LoginController.class);
	private static LoginService loginService=new LoginService();
	@Clear()
	public void index(){
		HttpSession session=getSession();
		if(session!=null){
			session.removeAttribute(Constants.SESSION_USER);
			session.removeAttribute(Constants.SESSION_COMPANY);
			session.removeAttribute(Constants.SESSION_ACCESSTOKEN);
			session.removeAttribute(Constants.SESSION_REFRESHTOKEN);
		}
		render("login.html");
	}
	
	/**
	 * 登录操作
	 */
	@Clear(AuthInterceptor.class)
	public void login(){
		//登录用户信息保存到session中
		Map<String, Object> userMap=(Map<String,Object>)JSON.parse(getPara("data"));
		DBObject userDB=MongoKit.toDBObject(userMap);
		Record userRecord=MongoKit.toRecord(userDB);
		String access_token=userMap.get("access_token").toString();
		String refresh_token=userMap.get("refresh_token").toString();
		String companyCode=userMap.get("company_code").toString();
		String companyId=userMap.get("company_id").toString();
		Record company=new Record();
		company.set("companyCode", companyCode);
		company.set("companyId", companyId);
		setSessionAttr(Constants.SESSION_ACCESSTOKEN,access_token);
		setSessionAttr(Constants.SESSION_REFRESHTOKEN,refresh_token);
		setSessionAttr(Constants.SESSION_USER,userRecord);
		setSessionAttr(Constants.SESSION_COMPANY, company);
		//定向到系统首页
		Record result=new Record();
		result.set("code", 200);
		renderJson(result);
	}
	
	private Map<String, Object> getParaMap(String string) {
		// TODO Auto-generated method stub
		return null;
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
