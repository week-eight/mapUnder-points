package weekeight.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * <p>
 * </p>
 *
 * @ClassName: ThymeleafController
 * @Description: 映射前端控制器
 * @Date: 2022/3/17/017 11:35
 * @author: week_eight
 * @version: v1.0
 */
@Controller
public class ThymeleafController {
    
    /**
     * Description: 主页，地图下钻
     * @return java.lang.String
     */
    @GetMapping(value = {"/", "/index", "/welcome"})
    public String toIndex(){
        return "index";
    }
    
    /**
     * Description: 地图点聚合
     * @param division 行政区划
     * @return java.lang.String
     */
    @GetMapping("/coordinate")
    public String coordinate(String division){
        return "coordinate";
    }
    
}
