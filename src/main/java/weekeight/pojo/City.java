package weekeight.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * </p>
 *
 * @ClassName: City
 * @Description: TODO
 * @Date: 2022/3/18/018 18:17
 * @author: week_eight
 * @version: v1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class City {
    /**
     * 行政区划
     */
    private String cityid;
    /**
     * 地区名称
     */
    private String city;
    /**
     * 订单量
     */
    private String orderCount;
    /**
     * 人数
     */
    private String driverNumber;
    /**
     * 车辆
     */
    private String vehicleNumber;
}
