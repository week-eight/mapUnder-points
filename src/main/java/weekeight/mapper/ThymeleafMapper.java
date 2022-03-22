package weekeight.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import weekeight.pojo.City;
import weekeight.pojo.points;

import java.util.List;

/**
 * <p>
 * </p>
 *
 * @ClassName: ThymeleafMapper
 * @Description: 数据传输
 * @Date: 2022/3/18/018 14:04
 * @author: week_eight
 * @version: v1.0
 */
@Mapper
public interface ThymeleafMapper {
    
    /**
     * Description: 全国省数据
     * @return java.util.Map
     */
    @Select("select address cityid,l.name city,order_count orderCount, driver_number driverNumber,vehicle_number vehicleNumber  from testOne l join aros.t_sys_district t2 on l.address = t2.id where t2.type = 1")
    List<City> selectNationwide();
    
    /**
     * Description: 城市、县区数据
     * @param provinceid 行政区划
     * @return java.util.List<net.weekeight.pojo.City>
     */
    @Select("select address cityid,l.name city,order_count orderCount, driver_number driverNumber,vehicle_number vehicleNumber  from testOne l join aros.t_sys_district t2 on l.address = t2.id where t2.supid=#{provinceid}")
    List<City> selectCity(String provinceid);
    
    /**
     * Description: 专属于直辖市的数据查询
     * @param provinceidStart 直辖市起始行政区划
     * @param provinceidEnd 直辖市结束行政区划
     * @return java.util.List<net.weekeight.pojo.City>
     */
    @Select("select address cityid,l.name city,order_count orderCount,driver_number driverNumber,vehicle_number vehicleNumber  from testOne l join aros.t_sys_district t2 on l.address = t2.id where t2.supid=#{provinceidStart} or t2.supid=#{provinceidEnd}")
    List<City> selectCityDirect(String provinceidStart, String provinceidEnd);
    
    /**
     * Description: 地图点聚合坐标查询
     * @param division 行政区划
     * @return java.util.List<net.weekeight.pojo.points>
     */
    @Select("select longitude xin,dimensionality yin from testTwo where division = #{division}")
    List<points> selectCoordinate(String division);
}
