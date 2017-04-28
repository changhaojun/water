package com.finfosoft.water.scada;

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
	
	public void review() {
		String scadaId = getPara(0);
		setAttr("scadaId", scadaId);
		render("scada_review.html");
	}
	
	public void edit() {
		String scadaId = getPara(0);
		setAttr("scadaId", scadaId);
		render("scada_edit.html");
	}
	
	public void select() {
		render("scada_select.html");
	}
	
	public void add() {
		String modelId = getPara(0);
		setAttr("modelId", modelId);
		render("scada_add.html");
	}
	
}
