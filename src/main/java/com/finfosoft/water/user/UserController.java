package com.finfosoft.water.user;

import org.apache.log4j.Logger;

import com.finfosoft.water.common.Constants;
import com.jfinal.aop.Clear;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

public class UserController extends Controller{
	private static Logger log=Logger.getLogger(UserController.class);
	private static UserService userService=new UserService(); 
	
	public void index(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String customerId=getSessionAttr(Constants.SESSION_CUSTOM_ID);
		String companyCode=company.get("companyCode");
		String companyId=company.get("companyId");
		String companyName=company.getStr("companyName");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		setAttr("customerId", customerId);
		setAttr("companyName",companyName);
		render("account.html");
	}
}
