package com.finfosoft.water.task;

import org.apache.log4j.Logger;

import com.finfosoft.water.common.Constants;
import com.jfinal.aop.Clear;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

public class TaskController extends Controller{
	private static Logger log=Logger.getLogger(TaskController.class);
	
	public void index(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyId=company.get("companyId");
		setAttr("companyId", companyId);
		render("task.html");
	}
	
	@Clear()
	public void taskStatus(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyId=company.get("companyId");
		setAttr("companyId", companyId);
		render("task_status.html");
	}
}
