package com.finfosoft.water.rundata;

import java.io.UnsupportedEncodingException;

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
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyCode=company.get("companyCode");
		String companyId=company.get("companyId");		
		String thingId = getPara(0);
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		setAttr("thingId", thingId);
		render("entity_data.html");
	}
	public void getCharts(){
		int dataId=Integer.parseInt(getPara(0).toString());
		String thingId=getPara(1).toString();
		setAttr("dataId", dataId);
		setAttr("thingId", thingId);
		render("chart_data.html");
	}
	
}
