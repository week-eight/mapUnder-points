package weekeight.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import weekeight.service.ThymeleafService;

import java.util.List;
import java.util.Map;

/**
 * <p>
 * </p>
 *
 * @ClassName: DataController
 * @Description: 地图请求控制器
 * @Date: 2022/3/18/018 14:18
 * @author: week_eight
 * @version: v1.0
 */
@RestController
public class DataController {
    @Autowired
    private ThymeleafService thymeleafService;
    
    /**
     * Description: 全国省数据
     * @return java.util.Map
     */
    @GetMapping("/nationwide")
    public Map nationwide() {
        return thymeleafService.findNationwide();
    }
    
    /**
     * Description: 城市，县区数据
     * @param provinceid 行政区划
     * @return java.util.Map
     */
    @GetMapping("/mock/city")
    public Map city(String provinceid) {
        System.out.println(provinceid);
        return thymeleafService.findCity(provinceid);
    }
    
    /**
     * Description: 地图点聚合
     * @param division 行政区划
     * @return java.util.List<java.util.List>
     */
    @PostMapping("/PointAggregation")
    public List<List> PointAggregation(String division) {
        return thymeleafService.findCoordinate(division);
    }
}
