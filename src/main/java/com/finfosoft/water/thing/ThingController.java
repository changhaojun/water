package com.finfosoft.water.thing;

import com.finfosoft.water.common.Constants;
import com.jfinal.core.Controller;
import com.jfinal.log.Logger;
import com.jfinal.plugin.activerecord.Record;

public class ThingController  extends  Controller{

	private static Logger log=Logger.getLogger(ThingController.class);
	private static ThingService thingService=new ThingService(); 
	
	public void index(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyCode=company.get("companyCode");
		String companyId=company.get("companyId");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		render("entity_list.html");
	}
	public void bindDatas(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyCode=company.get("companyCode");
		String companyId=company.get("companyId");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		String thingId=getPara(0);
		setAttr("thingId", thingId);
		render("bind_entity.html");
	}
	public void alarmDatas(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyCode=company.get("companyCode");
		String companyId=company.get("companyId");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		String thingId=getPara(0);
		setAttr("thingId", thingId);
		render("alarm_entity.html");
	}
	

}
