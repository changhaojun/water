package com.finfosoft.water.frame;

import org.apache.log4j.Logger;

import com.finfosoft.water.common.Constants;
import com.jfinal.aop.Clear;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

public class FrameController extends Controller{
	private static Logger log=Logger.getLogger(FrameController.class);
	
	private static FrameService frameService=new FrameService();
	/**
	 * 框架首页
	 */
	public void index(){
		render("");
	}
	
	/**
	 * 
	 * @Title: getUser
	 * @Description:
	 *    作用:获取用户信息
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @author dongmo(113552669@qq.com)
	 * @date 2017年1月24日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	public void getUser(){
		//Record result=new Record();
		Record user=getSessionAttr(Constants.SESSION_USER);
		//result.set("user", user);
		renderJson(user);
	}
	/**
	 * 
	 * @Title: saveToken
	 * @Description:
	 *    作用:将授权获得的返回参数存至session
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @author dongmo(113552669@qq.com)
	 * @date 2016年11月30日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	@Clear
	public void saveToken(){
		String accessToken=getPara("accessToken").toString();
		String refreshToken=getPara("refreshToken").toString();
		String username=getPara("username").toString();
		Record user=frameService.getUser(username);
		setSessionAttr(Constants.SESSION_ACCESSTOKEN, accessToken);
		setSessionAttr(Constants.SESSION_USER, user);
		setSessionAttr(Constants.SESSION_REFRESHTOKEN, refreshToken);
		Record result=new Record();
		result.set("result", 1);
		renderJson(result);
	}
	
	/**
	 * 
	 * @Title: getToken
	 * @Description:
	 *    作用:将授权获得的返回参数存至session
	 *    限制:
	 *    注意事项:
	 *    修改历史:(date:xxxx by:xxx comment:xxx)
	 * @author dongmo(113552669@qq.com)
	 * @date 2016年11月30日    
	 * @return void 
	 * @exception  (说明在某情况下，将发生什么异常)
	 */
	@Clear
	public void getToken(){
		Record result=new Record();
		String token=getSessionAttr(Constants.SESSION_ACCESSTOKEN);
		String refreshToken=getSessionAttr(Constants.SESSION_REFRESHTOKEN);
		result.set("accesstoken", token);
		result.set("refreshToken", refreshToken);
		renderJson(result);
	}
}
