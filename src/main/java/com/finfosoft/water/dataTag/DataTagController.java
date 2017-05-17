package com.finfosoft.water.dataTag;

import java.io.UnsupportedEncodingException;

import org.apache.log4j.Logger;

import com.finfosoft.water.common.Constants;
import com.finfosoft.water.frame.FrameController;
import com.jfinal.aop.Clear;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

public class DataTagController extends Controller{
	private static Logger log=Logger.getLogger(FrameController.class);
	private static DataTagService boxService=new DataTagService();
	
	/**
	 * 
	 * @Title: box
	 * @Description:
	 *    作用:打开传感器列表页面
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @author dongmo(113552669@qq.com)
	 * @date 2017年3月23日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	public void box(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyCode=company.get("companyCode");
		String companyId=company.get("companyId");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		render("box_info.html");
	}
	
	/**
	 * 
	 * @Title: plc
	 * @Description:
	 *    作用:打开plc列表页面
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @author dongmo(113552669@qq.com)
	 * @date 2017年3月23日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	public void plc(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyCode=company.get("companyCode");
		String companyId=company.get("companyId");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		render("plc_info.html");
	}
	
	/**
	 * 
	 * @Title: getDatas
	 * @Description:
	 *    作用:打开查看数据页面
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @author dongmo(113552669@qq.com)
	 * @date 2017年3月23日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	public void getDatas(){
		String boxId=getPara(0);
		String type=getPara(1);
		setAttr("boxId", boxId);
		setAttr("type", type);
		render("sensor_look.html");
	}
	/**
	 * 
	 * @Title: dataChart
	 * @Description:
	 *    作用:打开查看数据页面
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @author dongmo(113552669@qq.com)
	 * @date 2017年3月23日    
	 * @return void 
	 * @throws UnsupportedEncodingException 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	public void dataChart() throws UnsupportedEncodingException{
		String dataId=getPara(0);
		String dataName=getPara(1);
		String deviceId=getPara(2);
		String deviceName=getPara(3);
		
		setAttr("dataId", dataId);
		setAttr("dataName", java.net.URLDecoder.decode(dataName, "UTF-8"));
		setAttr("deviceId", deviceId);
		setAttr("deviceName", java.net.URLDecoder.decode(deviceName, "UTF-8"));
		render("realtime_data.html");
	}
	/**
	 * 
	 * @Title: addSensor
	 * @Description:
	 *    作用:打开新增传感器页面
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @author dongmo(113552669@qq.com)
	 * @date 2017年3月23日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	public void addSensor(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyCode=company.get("companyCode");
		String companyId=company.get("companyId");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		render("box_sensor_add.html");
	}
	
	/**
	 * 
	 * @Title: editSensor
	 * @Description:
	 *    作用:打开编辑传感器页面
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @author dongmo(113552669@qq.com)
	 * @date 2017年3月23日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	public void editSensor(){
		String sensorId=getPara(0);
		setAttr("deviceId", sensorId);
		render("box_sensor_edit.html");
	}
	/**
	 * 
	 * @Title: addPlc
	 * @Description:
	 *    作用:打开新增PLC页面
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @author dongmo(113552669@qq.com)
	 * @date 2017年3月23日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	public void addPlc(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyCode=company.get("companyCode");
		String companyId=company.get("companyId");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		render("box_plc_add.html");
	}
	
	
	/**
	 * 
	 * @Title: editPlc
	 * @Description:
	 *    作用:打开编辑PLC页面
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @author dongmo(113552669@qq.com)
	 * @date 2017年3月23日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	public void editPlc(){
		String plcId=getPara(0);
		setAttr("deviceId", plcId);
		render("box_plc_edit.html");
	}
	
	/**
	 * 
	 * @Title: manualEntry
	 * @Description:
	 *    作用:打开人工录入列表页面
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @author dongmo(113552669@qq.com)
	 * @date 2017年5月11日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 * 
	 * */
	public void manualEntry(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyCode=company.get("companyCode");
		String companyId=company.get("companyId");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		render("manual_entry.html");
	}
	
	/**
	 * 
	 * @Title: addManual
	 * @Description:
	 *    作用:打开新增、修改人工录入页面
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @author dongmo(113552669@qq.com)
	 * @date 2017年5月12日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 * 
	 * */
	public void addManual(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyCode=company.get("companyCode");
		String companyId=company.get("companyId");
		String deviceId="";
		if(getPara(0)!=null){
			deviceId=getPara(0);
		}
		setAttr("deviceId", deviceId);
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		render("manual_data.html");
	}
	
	/**
	 * 
	 * @Title: computedEntry
	 * @Description:
	 *    作用:打开计算数值列表页面
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @author dongmo(113552669@qq.com)
	 * @date 2017年5月15日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 * 
	 * */
	public void computedEntry(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyCode=company.get("companyCode");
		String companyId=company.get("companyId");
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		render("computed_entry.html");
	}
	
	/**
	 * 
	 * @Title: addManual
	 * @Description:
	 *    作用:打开新增、修改人工录入页面
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @author dongmo(113552669@qq.com)
	 * @date 2017年5月12日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 * 
	 * */
	public void addComputed(){
		Record company=getSessionAttr(Constants.SESSION_COMPANY);
		String companyCode=company.get("companyCode");
		String companyId=company.get("companyId");
		String deviceId="";
		if(getPara(0)!=null){
			deviceId=getPara(0);
		}
		setAttr("deviceId", deviceId);
		setAttr("companyCode", companyCode);
		setAttr("companyId", companyId);
		render("computed_data.html");
	}
}
