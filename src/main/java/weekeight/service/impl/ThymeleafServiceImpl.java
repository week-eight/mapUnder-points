package weekeight.service.impl;

import org.springframework.stereotype.Service;
import weekeight.mapper.ThymeleafMapper;
import weekeight.pojo.City;
import weekeight.pojo.points;
import weekeight.service.ThymeleafService;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * </p>
 *
 * @ClassName: ThymeleafServiceImpl
 * @Description: 业务实现
 * @Date: 2022/3/18/018 14:04
 * @author: week_eight
 * @version: v1.0
 */
@Service
public class ThymeleafServiceImpl implements ThymeleafService {
    @Resource
    private ThymeleafMapper thymeleafMapper;
    
    /**
     * Description: 全国省数据
     * @return java.util.Map
     */
    @Override
    public Map findNationwide() {
        List<City> list = thymeleafMapper.selectNationwide();
        Map<String, Object> map = new HashMap();
        map.put("errcode", 1);
        map.put("msg", list);
        System.out.println("响应："+map);
        return map;
    }
    
    /**
     * Description: 城市，县区数据
     * @param provinceid 行政区划
     * @return java.util.Map
     */
    @Override
    public Map findCity(String provinceid) {
        List<City> list = new ArrayList<>();
        if ("500000".equals(provinceid) || "310000".equals(provinceid) || "120000".equals(provinceid) || "110000".equals(provinceid)) {
            int original = Integer.parseInt(provinceid);
            String provinceidStart = String.valueOf(original + 100);
            String provinceidEnd = String.valueOf(original + 200);
            list = thymeleafMapper.selectCityDirect(provinceidStart,provinceidEnd);
        } else {
            list = thymeleafMapper.selectCity(provinceid);
        }
        Map<String, Object> map = new HashMap();
        map.put("errcode", 1);
        map.put("msg", list);
        System.out.println("响应："+map);
        return map;
    }
    
    /**
     * Description: 地图点聚合
     * @param division 行政区划
     * @return java.util.List<java.util.List>
     */
    @Override
    public List<List> findCoordinate(String division) {
    
        List<points> listResult = thymeleafMapper.selectCoordinate(division);
        List<List> list1 = new ArrayList<>();
        for (points p : listResult) {
            List<String> list = new ArrayList<>();
            list.add(p.getXin());
            list.add(p.getYin());
            list1.add(list);
        }
        return list1;
    }
}
