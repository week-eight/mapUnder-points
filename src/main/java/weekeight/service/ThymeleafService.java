package weekeight.service;

import java.util.List;
import java.util.Map;

/**
 * <p>
 * </p>
 *
 * @ClassName: ThymeleafService
 * @Description: 业务接口
 * @Date: 2022/3/18/018 14:04
 * @author: week_eight
 * @version: v1.0
 */
public interface ThymeleafService {
    /**
     * Description: 全国省数据
     * @return java.util.Map
     */
    Map findNationwide();
    
    /**
     * Description: 城市，县区数据
     * @param provinceid 行政区划
     * @return java.util.Map
     */
    Map findCity(String provinceid);
    
    /**
     * Description: 地图点聚合
     * @param division 行政区划
     * @return java.util.List<java.util.List>
     */
    List<List> findCoordinate(String division);
}
