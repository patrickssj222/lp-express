import React, { Component } from 'react';
import NewWindow from 'react-new-window'
// import jsPDF from 'jspdf';
// import html2canvas from "html2canvas";

import './PrintResult.css';


class PrintResult extends Component {

    constructor(props) {
        super(props);
        this.printRef = React.createRef(); // reference to the things that need to be printed
        this.visa_names = {
            加拿大学签: "学签",
            加拿大旅游签: "访问签",
            加拿大工签: "工签",
            加拿大移民: "PR",
            加拿大公民: "公民",
            加拿大难民: "学签",
            首次签证: "学签"
        }
        this.visa_types = {}
        for (let visa_name in this.visa_names) {
            this.visa_types[visa_name] = <p> &#x25EF; {this.visa_names[visa_name]} </p>
        }
        // dynamically update the visa type by filling in the circle.
        this.visa_types[this.props.detail.visa_type] = <p> &#9673; {this.visa_names[this.props.detail.visa_type]} </p>;
    }
    
    // // html2canvas + jsPDF generate PDF
    // // html -> canvas -> pdf
    // handleDownloadPDF = (callback) => {
    //     html2canvas(this.printRef.current).then(function(canvas) {
    //         document.body.appendChild(canvas);
    //         const imgData = canvas.toDataURL("image/png");
    //         const pdf = new jsPDF();
    //         // pdf.addImage(imgData, "PNG", 7, 10, 199, 260); // base line
    //         // pdf.addImage(imgData, "PNG", 7, 10, 199, 255);
    //         pdf.addImage(imgData, "PNG", 7, 15, 199, 245);
    //         pdf.save("downloadedPdf.pdf");
    //         document.body.removeChild(canvas) // remove the canvas that was used to create the pdf.
    //         callback(); // callback to mutate state in parent component.
    //     });
    // };

    render () {
        return(
            <NewWindow
            name={"Preview PDF"}
            features={{
                width: "1200px",
                height: "1000px"
            }}>
                <div className={"print-wrapper"} ref={this.printRef}> 
                    <div className={"print-top"}>
                        <div className={"logo-box"}>
                            <img style={{width: "400px", height: "120px"}} src={window.location.origin + '/img/logo&words1.1.png'}/>
                            {/* <div className={"logo-text-bottom"}> 我们能做的比你想象的更多</div>
                            <div className={"logo-text-right"}> 加诺咨询 </div> */}
                        </div>
                        <div className={"watermark"}>
                            <small>20 Amber Street, Unit 201</small>
                            <small>Markham, ON</small>
                            <small>L3R SP4</small>
                        </div>
                    </div>
                    <div className={"print-header"}>
                        加诺咨询 - 加拿大境内客户信息收集表
                    </div>
                    <div className={"print-body"}>
                        <div className={"flex-table"}>
                            <div className={"flex-row"}>
                                <div style={{fontSize: "24px", borderWidth:"1px 1px 1px 0px"}} className={"flex-cell"}>
                                    基本信息
                                </div>
                            </div>
                            <div className={"flex-row"}>
                                <div className={"flex-cell label"}>
                                    姓名
                                </div>
                                <div className={"flex-cell"}>
                                    {this.props.detail.name}
                                </div>
                                <div className={"flex-cell label"}>
                                    曾用名
                                </div>
                                <div className={"flex-cell"}>
                                    {this.props.detail.used_name}
                                </div>
                                <div className={"flex-cell label"}>
                                    性别
                                </div>
                                <div className={"flex-cell"}>
                                    {this.props.detail.gender}
                                </div>
                            </div>
                            <div className={"flex-row"}>
                                <div className={"half-row"}>
                                    <div className={"flex-cell label"}>
                                        出生日期
                                    </div>
                                    <div className={"flex-cell"}>
                                        {this.props.detail.dob}
                                    </div>
                                    </div>
                                <div className={"half-row"}>
                                    <div className={"flex-cell label"}>
                                        出生地
                                    </div>
                                    <div className={"flex-cell"}>
                                        {this.props.birth_geo.city+" "+this.props.birth_geo.province+" "+this.props.birth_geo.region}
                                    </div>
                                </div>
                            </div>
                            <div className={"flex-row"}>
                                <div className={"half-row"}>
                                    <div className={"flex-cell label"}>
                                        手机电话
                                    </div>
                                    <div className={"flex-cell"}>
                                        {this.props.detail.phone}
                                    </div>
                                </div>
                                <div className={"half-row"}>
                                    <div className={"flex-cell label"}>
                                        邮箱
                                    </div>
                                    <div className={"flex-cell"}>
                                        {this.props.detail.email}
                                    </div>
                                </div>
                            </div>
                            <div className={"flex-row"}>
                                <div className={"half-row"}>
                                    <div className={"flex-cell label"}>
                                        国籍
                                    </div>
                                    <div className={"flex-cell"}>
                                        {this.props.detail.citizenship}
                                    </div>
                                </div>
                                <div className={"half-row"}>
                                    <div className={"flex-cell label"}>
                                        中国身份证号码
                                    </div>
                                    <div className={"flex-cell"}>
                                        {this.props.detail.identification_number}
                                    </div>
                                </div>
                            </div>
                            <div className={"flex-row"}>
                                <div className={"flex-cell label"}>
                                    在加身份
                                </div>
                                <div className={"flex-cell"}>
                                    {/* {this.props.detail.visa_type} */}
                                    <div className={"flex-inner-container"}>
                                        <div className={"flex-inner-cell"}> 
                                        {this.visa_types.加拿大学签} 
                                        </div>
                                        <div className={"flex-inner-cell"}> 
                                        {this.visa_types.加拿大工签} 
                                        </div>   
                                        <div className={"flex-inner-cell"}> 
                                        {this.visa_types.加拿大旅游签}
                                        </div>  
                                        <div className={"flex-inner-cell"}> 
                                        {this.visa_types.加拿大移民} 
                                        </div>
                                        <div className={"flex-inner-cell"}> 
                                        {this.visa_types.加拿大公民} 
                                        </div>  
                                    </div>
                                </div>
                            </div>
                            <div className={"flex-row"}>
                            <div className={"half-row"}>
                                <div className={"flex-cell label"}>
                                    护照号码
                                </div>
                                <div className={"flex-cell"}>
                                    {this.props.detail.passport_number}
                                </div>
                            </div>
                            <div className={"half-row"}>
                                <div className={"flex-cell label"}>
                                    护照到期日
                                </div>
                                <div className={"flex-cell"}>
                                    {this.props.detail.passport_due}
                                </div>
                            </div>
                            </div>
                            <div className={"flex-row"}>
                                <div className={"half-row"}>
                                    <div className={"flex-cell label"}>
                                        签证到期日
                                    </div>
                                    <div className={"flex-cell"}>
                                        {this.props.detail.visa_due}
                                    </div>
                                </div>
                                <div className={"half-row"}>
                                    <div className={"flex-cell label"}>
                                        加拿大UCI号码
                                    </div>
                                    <div className={"flex-cell"}>
                                        {this.props.detail.uci_number}
                                    </div>                          
                                </div>
                            </div>
                            <div className={"flex-row"}>
                            <div className={"half-row"}>
                            <div className={"flex-cell label"}>
                                    中国现居省份
                                </div>
                                <div className={"flex-cell"}>
                                    {this.props.china_geo.province+" "+this.props.china_geo.region}
                                </div>
                            </div>
                            <div className={"half-row"}>
                                <div className={"flex-cell label"}>
                                    中国现居城市
                                </div>
                                <div className={"flex-cell"}>
                                    {this.props.china_geo.city}
                                </div>                                
                            </div>
                            </div>
                            <div className={"flex-row"}>
                            <div className={"half-row"}>
                                <div className={"flex-cell label"}>
                                    加拿大现居地址
                                </div>
                                <div className={"flex-cell"}>
                                    {this.props.detail.canada_address}
                                </div>
                            </div>
                            <div className={"half-row"}>
                                <div className={"flex-cell label"}>
                                    加拿大现址城市
                                </div>
                                <div className={"flex-cell"}>
                                    {this.props.detail.canada_address}
                                </div>
                            </div>
                            </div>
                            <div className={"flex-row"}>
                            <div className={"half-row"}>
                                <div className={"flex-cell label"}>
                                    加拿大现居省份
                                </div>
                                <div className={"flex-cell"}>
                                    {this.props.detail.canada_address}
                                </div>
                            </div>
                            <div className={"half-row"}>
                                <div className={"flex-cell label"}>
                                    加拿大现址邮编
                                </div>
                                <div className={"flex-cell"}>
                                    {this.props.detail.postal_code}
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className={"flex-table"}>
                            <div className={"flex-row"}>
                                <div className={"half-row"}>
                                    <div className={"flex-cell label"}>
                                        客户
                                    </div>
                                    <div className={"flex-cell"}>
                                        {this.props.detail.name}
                                    </div>
                                </div>
                                <div className={"half-row"}>
                                    <div className={"flex-cell label"}>
                                        信息收集人
                                    </div>
                                    <div className={"flex-cell"}>
                                    </div>
                                </div>
                            </div>
                            <div className={"flex-row large-row"}>
                            <div className={"half-row"}>
                                <div className={"flex-cell label"}>
                                    客户签字
                                </div>
                                <div className={"flex-cell to-fill"}>
                                    <small>请与护照签名一致</small>
                                </div>
                            </div>
                            <div className={"half-row"}>
                                <div className={"flex-cell label"}>
                                    日期
                                </div>
                                <div className={"flex-cell to-fill"}>
                                    <small>YYYY-MM-DD</small>
                                </div>
                            </div>
                            </div>
                            <div className={"flex-row large-row"}>
                            <div className={"half-row"}>
                                <div className={"flex-cell label"}>
                                    信息收集人签字
                                </div>
                                <div className={"flex-cell to-fill"}>
                                    <small>YYYY-MM-DD</small>
                                </div>
                            </div>
                            <div className={"half-row"}>
                                <div className={"flex-cell label"}>
                                    日期
                                </div>
                                <div className={"flex-cell to-fill"}>
                                    <small>YYYY-MM-DD</small>
                                </div>                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"print-footer"}>
                    <div className={"footer-info"}>
                        <img className={"footer-image"} src={window.location.origin + '/img/email.png'} />
                        <div className={"footer-text"}> 
                            info@lpfirm.ca
                        </div>
                    </div>
                    <div className={"footer-info"}>
                        <img className={"footer-image"} src={window.location.origin + '/img/internet.png'} />
                        <div className={"footer-text"}> 
                            www.lpfirm.ca
                        </div>
                    </div>
                    <div className={"footer-info"}>
                        <img className={"footer-image"} src={window.location.origin + '/img/phone.png'} />
                        <div className={"footer-text"}> 
                            647-978-8567
                        </div>
                    </div>
                </div>
            </div>
            </NewWindow>
        )
    }
}

export default PrintResult;
