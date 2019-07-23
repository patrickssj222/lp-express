module.exports = (info)=>{
    return `<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>PDF Result Template</title>
    <style>
        .print-wrapper{
            max-width: 800px;
            margin: auto;
            padding: 30px;
            font-size: 9px;
            line-height: 24px;
            font-family: Tahoma, Arial, Helvetica, "Microsoft YaHei New", "Microsoft Yahei", "微软雅黑", 宋体, SimSun, STXihei, "华文细黑", sans-serif;
            color: black;
            height:750px;
            text-align: center;
        }

        .print-wrapper .print-header{
            font-size:20px;
            margin:30px;
        }

        .print-wrapper .flex-table{
            width:100%;
            border-collapse: collapse;
            margin: 0 auto 30px auto;
        }

        .print-wrapper .flex-row{
            width:100%;
        }

        .print-wrapper .flex-row .flex-cell{
            border: 1px solid black;
            text-align: center;
            text-wrap: none;
            padding:0px 10px;
        }

        .print-wrapper .large-row .flex-cell{
            padding:0 10px;
            height:50px;
        }

        .print-wrapper small{
            position: relative;
            top:15px;
            color:gray;
        }

        .print-wrapper .print-top{
            width:100%
        }

        .print-wrapper .print-top .watermark{
            width:100%
        }

        .print-wrapper .print-footer{
            margin-top: 180px;
        }
        .print-wrapper .print-footer .flex-cell{
            border: none;
        }
    </style>
</head>
<body>
<div class="print-wrapper">
    <table class="print-top">
        <tr>
            <td><h1>Logo</h1></td>
            <td>
                <table class="watermark">
                    <tr><td align="right">20 Amber Street, Unit 201</td></tr>
                    <tr><td align="right">Markham, ON</td></tr>
                    <tr><td align="right">L3R SP4</td></tr>
                </table>
            </td>
        </tr>
    </table>
    <div class= "print-header">
        加诺咨询-加拿大境内客户信息收集表
    </div>
    <div class= "print-body">
        <table class= "flex-table" align="center">
            <tr class= "flex-row">
                <td class= "flex-cell" colspan="18" nowrap="true">
                    基本信息
                </td>
            </tr>
            <tr class= "flex-row">
                <td class= "flex-cell label" colspan="2" nowrap="true">
                    姓名
                </td>
                <td class= "flex-cell" colspan="4" nowrap="true">
                    ${info.detail.name}
                </td>
                <td class= "flex-cell label" colspan="2" nowrap="true">
                    曾用名
                </td>
                <td class= "flex-cell" colspan="4" nowrap="true">
                    ${info.detail.used_name}
                </td>
                <td class= "flex-cell label" colspan="2" nowrap="true">
                    性别
                </td>
                <td class= "flex-cell" colspan="4" nowrap="true">
                    ${info.detail.gender}
                </td>
            </tr>
            <tr class= "flex-row">
                <td class= "flex-cell label" colspan="3" nowrap="true">
                    出生日期
                </td>
                <td class= "flex-cell" colspan="6" nowrap="true">
                    ${info.detail.dob}
                </td>
                <td class= "flex-cell label" colspan="3" nowrap="true">
                    出生地
                </td>
                <td class= "flex-cell" colspan="6" nowrap="true">
                    ${info.birth_geo.city+", "+info.birth_geo.province+", "+info.birth_geo.region}
                </td>
            </tr>
            <tr class= "flex-row">
                <td class= "flex-cell label" colspan="3" nowrap="true">
                    电话
                </td>
                <td class= "flex-cell" colspan="6" nowrap="true">
                    ${info.detail.phone}
                </td>
                <td class= "flex-cell label" colspan="3" nowrap="true">
                    邮箱
                </td>
                <td class= "flex-cell" colspan="6" nowrap="true">
                    ${info.detail.email}
                </td>
            </tr>
            <tr class= "flex-row">
                <td class= "flex-cell label" colspan="3" nowrap="true">
                    国籍
                </td>
                <td class= "flex-cell" colspan="6" nowrap="true">
                    ${info.detail.citizenship}
                </td>
                <td class= "flex-cell label" colspan="3" nowrap="true">
                    中国身份证号码
                </td>
                <td class= "flex-cell" colspan="6" nowrap="true">
                    ${info.detail.identification_number}
                </td>
            </tr>
            <tr class= "flex-row">
                <td class= "flex-cell label" colspan="3" nowrap="true">
                    护照号码
                </td>
                <td class= "flex-cell" colspan="6" nowrap="true">
                    ${info.detail.passport_number}
                </td>
                <td class= "flex-cell label" colspan="3" nowrap="true">
                    护照到期日
                </td>
                <td class= "flex-cell" colspan="6" nowrap="true">
                    ${info.detail.passport_due}
                </td>
            </tr>
            <tr class= "flex-row">
                <td class= "flex-cell label" colspan="3" nowrap="true">
                    在加身份
                </td>
                <td class= "flex-cell" colspan="6" nowrap="true">
                    ${info.detail.visa_type}
                </td>
                <td class= "flex-cell label" colspan="3" nowrap="true">
                    签证到期日
                </td>
                <td class= "flex-cell" colspan="6" nowrap="true">
                    ${info.detail.visa_due}
                </td>
            </tr>
            <tr class= "flex-row">
                <td class= "flex-cell label" colspan="3" nowrap="true">
                    加拿大UCI号码
                </td>
                <td class= "flex-cell" colspan="6" nowrap="true">
                    ${info.detail.uci_number}
                </td>
                <td class="flex-cell label" colspan="3" nowrap="true">
                    中国现居地址
                </td>
                <td class="flex-cell" colspan="6" nowrap="true">
                    ${info.china_geo.city+", "+info.china_geo.province+", "+info.china_geo.region}
                </td>
            </tr>
            <tr class="flex-row">
                <td class="flex-cell label" colspan="3" nowrap="true">
                    加拿大现居地址
                </td>
                <td class="flex-cell" colspan="6" nowrap="true">
                    ${info.detail.canada_address}
                </td>
                <td class="flex-cell label"colspan="3" nowrap="true">
                    加拿大现址邮编
                </td>
                <td class="flex-cell"colspan="6" nowrap="true">
                    ${info.detail.postal_code}
                </td>
            </tr>
        </table>
        <table class="flex-table">
            <tr class="flex-row">
                <td class="flex-cell label" nowrap="true">
                    客户
                </td>
                <td class="flex-cell" nowrap="true">
                    ${info.detail.name}
                </td>
                <td class="flex-cell label" nowrap="true">
                    信息收集人
                </td>
                <td class="flex-cell" nowrap="true">
                    <div></div>
                </td>
            </tr>
            <tr class="flex-row large-row">
                <td class="flex-cell label">
                    客户签字
                </td>
                <td class="flex-cell to-fill" nowrap="true">
                    <small>请与护照签名一致</small>
                </td>
                <td class="flex-cell label" nowrap="true">
                    日期
                </td>
                <td class="flex-cell to-fill" nowrap="true">
                    <small>YYYY-MM-DD</small>
                </td>
            </tr>
            <tr class="flex-row large-row">
                <td class="flex-cell label" nowrap="true">
                    信息收集人签字
                </td>
                <td class="flex-cell" nowrap="true">
                </td>
                <td class="flex-cell label" nowrap="true">
                    日期
                </td>
                <td class="flex-cell to-fill" nowrap="true">
                    <small>YYYY-MM-DD</small>
                </td>
            </tr>
        </table>
    </div>
    <div class="print-footer" align="bottom">
        <table class="flex-table">
            <tr class="flex-row">
                <td class="flex-cell" nowrap="true">
                    邮箱:info@lpfirm.ca
                </td>
                <td class="flex-cell" nowrap="true">
                    网站:www.lpfirm.ca
                </td>
                <td class="flex-cell" nowrap="true">
                    电话:647-978-8567
                </td>
            </tr>
        </table>
    </div>
</div>
</body>
</html>`
}