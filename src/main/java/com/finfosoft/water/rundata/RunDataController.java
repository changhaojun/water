package com.finfosoft.water.rundata;

import com.finfosoft.water.common.Constants;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

public class RunDataController extends Controller{
	
	public void index(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyCode=company.get("companyCode");
		String companyId=company.get("companyId");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		render("run_data.html");
	}
	
	public void getDatas(){
		String thingId = getPara(0);
		setAttr("thingId", thingId);
		render("entity_data.html");
	}

}
