package com.finfosoft.water.common;

import org.apache.log4j.Logger;

import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;
import com.jfinal.core.Controller;


public class GlobalAttrInterceptor implements Interceptor{
	private static Logger log = Logger.getLogger(GlobalAttrInterceptor.class);
	public void intercept(Invocation invoc) {
		Controller controller = invoc.getController();
		
		//全局变量
		String path=controller.getRequest().getContextPath();
		controller.setAttr("css_path", path+"/css/");
		controller.setAttr("js_path", path+"/js/");
		controller.setAttr("img_path", path+"/img/");
		
		invoc.invoke();
	}
}
