package com.finfosoft.water.thing;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import com.finfosoft.water.common.Constants;
import com.jfinal.core.Controller;
import com.jfinal.log.Logger;
import com.jfinal.plugin.activerecord.Record;


public class ThingController  extends  Controller{

	private static Logger log=Logger.getLogger(ThingController.class);
	private static ThingService thingService=new ThingService(); 
	
	public void index(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String customerId=getSessionAttr(Constants.SESSION_CUSTOM_ID);
		String companyCode=company.get("companyCode");
		String companyId=company.get("companyId");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		setAttr("customerId",customerId);
		render("entity_list.html");
	}
	public void bindDatas() throws UnsupportedEncodingException{
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String customerId=getSessionAttr(Constants.SESSION_CUSTOM_ID);
		String companyCode=company.get("companyCode");
		String companyId=company.get("companyId");
		String thingId=getPara(0);
		String thingName=URLDecoder.decode(getPara(1), "UTF-8");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		setAttr("customerId",customerId);
		setAttr("thingName", thingName);
		setAttr("thingId", thingId);
		render("bind_entity.html");
	}
	public void alarmDatas() throws UnsupportedEncodingException{
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String customerId=getSessionAttr(Constants.SESSION_CUSTOM_ID);
		String companyCode=company.get("companyCode");
		String companyId=company.get("companyId");
		String thingId=getPara(0);
		String thingName=URLDecoder.decode(getPara(1), "UTF-8");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		setAttr("customerId",customerId);
		setAttr("thingName", thingName);
		setAttr("thingId", thingId);
		render("alarm_entity.html");
	}
	

}
