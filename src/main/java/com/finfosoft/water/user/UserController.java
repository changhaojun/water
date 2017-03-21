package com.finfosoft.water.user;

import org.apache.log4j.Logger;

import com.jfinal.aop.Clear;
import com.jfinal.core.Controller;

public class UserController extends Controller{
	private static Logger log=Logger.getLogger(UserController.class);
	private static UserService userService=new UserService(); 
	
	public void index(){
		render("account.html");
	}
}
