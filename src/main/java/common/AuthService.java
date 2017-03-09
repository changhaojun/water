package common;

import java.util.HashMap;
import java.util.Map;

import com.finfosoft.db.mongo.MongoKit;

public class AuthService extends BaseService{

	public boolean isAuthUrl(String url) {
		Map<String, Object> filter = new HashMap<String, Object>();
		filter.put("url", url);
		int count = MongoKit.queryCount("auth_url", filter, null, null);
		if (count > 0) {
			return true;
		} else {
			return false;
		}
	}

}
