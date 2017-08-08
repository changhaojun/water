package com.finfosoft.water.report;

import org.apache.log4j.Logger;

import com.jfinal.core.Controller;

public class ReportController extends Controller{
	private static Logger log=Logger.getLogger(ReportController.class);
	
	
	/**
	 * 
	 * @Title: index
	 * @Description:
	 *    作用:报表页面
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @author dongmo(113552669@qq.com)
	 * @date 2017年8月3日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	public void index(){
		render("report_list.html");
	}
	
	/**
	 * 
	 * @Title: reportForm
	 * @Description:
	 *    作用:报表页面
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @author dongmo(113552669@qq.com)
	 * @date 2017年8月7日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	public void reportForm(){
		String reportId=getPara(0);
		setAttr("reportId", reportId);
		render("report_form.html");
	}
}
