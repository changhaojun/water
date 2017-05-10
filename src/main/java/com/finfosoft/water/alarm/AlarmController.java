package com.finfosoft.water.alarm;

import org.apache.log4j.Logger;

import com.finfosoft.water.common.Constants;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

public class AlarmController extends Controller{
	private static Logger log=Logger.getLogger(AlarmController.class);
	
	public void index(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyId=company.get("companyId");
		setAttr("companyId", companyId);
		render("alarm_history.html");
	}
}
