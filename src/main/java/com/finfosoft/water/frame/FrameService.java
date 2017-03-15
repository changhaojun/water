package com.finfosoft.water.frame;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.finfosoft.db.mongo.MongoKit;
import com.finfosoft.water.common.BaseService;
import com.jfinal.plugin.activerecord.Record;

public class FrameService extends BaseService{
	private static Logger log=Logger.getLogger(FrameService.class);

	public Record getUser(String username) {
		// TODO Auto-generated method stub
		Map<String,Object>filter=new HashMap<String,Object>();
		filter.put("username", username);
		Record user =new Record();
		List<Record> users=MongoKit.query("user", filter);
		if(users.size()>0){
			user=users.get(0);
		}
		return user;
	}

}
