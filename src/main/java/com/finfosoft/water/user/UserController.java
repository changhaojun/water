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
		String companyCode=company.get("companyCode");
		String companyId=company.get("companyId");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		render("account.html");
	}
}
