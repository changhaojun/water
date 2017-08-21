package com.finfosoft.water.globalConfig;

import org.apache.log4j.Logger;

import com.finfosoft.water.common.Constants;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;


public class GlobalConfigController extends Controller {
	private static Logger log=Logger.getLogger(GlobalConfigController.class);
	
	public void index(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyId=company.get("companyId");
		setAttr("companyId", companyId);
		render("global_config.html");
	}

}
