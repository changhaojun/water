package com.finfosoft.water.operatelog;

import com.finfosoft.water.common.Constants;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

public class OperateLogController extends Controller{
	public void taskList(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyCode=company.get("companyCode");
		String companyId=company.get("companyId");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		render("job_log.html");
	}
	public void lssuedList(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyCode=company.get("companyCode");
		String companyId=company.get("companyId");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		render("lssued_log.html");
	}

}
