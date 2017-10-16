package com.finfosoft.water.scada;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSON;
import com.finfosoft.water.common.Constants;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

public class ScadaController extends Controller{
	private static Logger log=Logger.getLogger(ScadaController.class);
	
	public void index() {
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyCode=company.get("companyCode");
		String companyId=company.get("companyId");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		render("scada_list.html");
	}
	
	public void review() throws UnsupportedEncodingException {
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyId=company.get("companyId");
		String scadaId = getPara(0);
		String scadaName = URLDecoder.decode(getPara(1), "UTF-8");
		String scadaDescription = URLDecoder.decode(getPara(2), "UTF-8");
		setAttr("scadaId", scadaId);
		setAttr("companyId", companyId);
		setAttr("scadaName", scadaName);
		setAttr("scadaDescription", scadaDescription);
		render("scada_review.html");
	}
	
	public void edit() {
		String scadaId = getPara(0);
		String thingId = getPara(1);
		setAttr("scadaId", scadaId);	
		setAttr("thingId", thingId);
		render("scada_edit.html");
	}
	
	public void select() {
		render("scada_select.html");
	}
	
	public void add() {
		//String modelId = getPara(0);
		String thingId = getPara(0);
		setAttr("thingId", thingId);
		render("scada_add.html");
	}
	
}
