package com.finfosoft.water.alarm;

import org.apache.log4j.Logger;

import com.finfosoft.water.common.Constants;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

public class AlarmController extends Controller{
	private static Logger log=Logger.getLogger(AlarmController.class);
	
	
	/**
	 * 
	 * @Title: index
	 * @Description:
	 *    作用:历史告警列表
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @author dongmo(113552669@qq.com)
	 * @date 2017年6月23日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	public void index(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyId=company.get("companyId");
		setAttr("companyId", companyId);
		render("alarm_history.html");
	}
}
