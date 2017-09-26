package com.finfosoft.water.preconditionsConfig;

import com.finfosoft.water.common.Constants;
import com.jfinal.core.Controller;
import com.jfinal.log.Logger;
import com.jfinal.plugin.activerecord.Record;

public class PreconditionsConfig extends Controller {
	
	private static Logger log=Logger.getLogger(PreconditionsConfig.class);
	
	public void index(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyId=company.get("companyId");
		setAttr("companyId", companyId);
		render("conditions_config.html");
	}
	
}
