var settingIds = [];
var settingKeys = [];
var settingValues = [];
var captchaType;
class MyComponent {
    constructor() {
        this.$el = null;
        this.table_direct = null;
    }

    init() {
        this.$el = $("#settingContainer");

        this._activeTab();
        this._loadDataSetting();
    }
    _activeTab() {
        $("#nav-option .nav-link").removeClass("active");
        $("#setting-link").addClass("active");
    }
    _loadDataSetting() {
        getDataSetting();
        function getDataSetting() {
            var url = "https://localhost:7132/Setting/GetAllSetting";
            $.ajax({
                url: url,
                method: 'GET',
                success: (data) => {
                    // Mảng các SettingKey cần thiết
                    const requiredSettingKeys = [
                        //Kiểm tra cú pháp mật khẩu
                        'enablesyntaxchecking',
                        'minimumlength',
                        'minimumlowercase',
                        'minimumuppercase',
                        'minimumnumbers',
                        'minimumsymbols',                       
                        //Sử dụng captcha
                        'enablecaptcha',
                        'captchatype',
                        'captchakeynumbers'
                    ];

                    settingIds = [];
                    settingKeys = [];
                    settingValues = [];
                    for (let i = 0; i < data.length; i++) {
                        var dataItem = data[i];
                        if (requiredSettingKeys.includes(dataItem.key)) {
                            settingIds.push(dataItem.id);
                            settingKeys.push(dataItem.key);
                            settingValues.push(dataItem.value);
                        }
                    }

                    UpdateForm();
                },
                error: (xhr, status, error) => {
                    console.error('Error fetching data:', status, error);
                }
            });
        }
        function UpdateForm() {
            settingKeys.forEach((key, index) => {
                var value = settingValues[index];
                switch (key) {
                    //Kiểm tra cú pháp mật khẩu
                    case 'enablesyntaxchecking':
                        $('#cb-pass').prop('checked', value === 'True' ? true : false);
                        break;
                    case 'minimumlength':
                        $('#length-pass').val(value);
                        break;
                    case 'minimumlowercase':
                        $('#min-anphabet1').val(value);
                        break;
                    case 'minimumuppercase':
                        $('#min-anphabet2').val(value);
                        break;
                    case 'minimumnumbers':
                        $('#min-number').val(value);
                        break;
                    case 'minimumsymbols':
                        $('#min-char').val(value);
                        break;
                    //Sử dụng captcha                
                    case 'enablecaptcha':
                        $('#cb-captcha').prop('checked', value === 'True' ? true : false);
                        toggleEnabledCaptcha(value === 'True' ? true : false);
                        captchaType = value;
                        break;
                    case 'captchatype':
                        $('#cb-captchaApha').prop('checked', value === 'Text' ? true : false);
                        $('#cb-captchaNumber').prop('checked', value === 'Math' ? true : false);
                        toggleCaptchaType(captchaType === 'True' ? true : false);
                        break;
                    case 'captchakeynumbers':
                        $('#min-captcha').val(value);
                        break;
                }
            });
        }
        $('#policyConfirmBtn').on('click', function () {
            UpdateSyntaxChecking();
            function UpdateSyntaxChecking() {
                if (settingIds.length > 0) {
                    for (let i = 0; i < settingIds.length; i++) {
                        const settingId = settingIds[i];
                        const settingKey = settingKeys[i];
                        // Lấy giá trị từ form dựa trên settingKey
                        let settingValue;
                        switch (settingKey) {
                            //Kiểm tra cú pháp mật khẩu
                            case 'enablesyntaxchecking':
                                settingValue = $('#cb-pass').is(':checked') ? 'True' : 'False'; // Giá trị boolean cho checkbox
                                break;
                            case 'minimumlength':
                                settingValue = $('#length-pass').val();
                                break;
                            case 'minimumlowercase':
                                settingValue = $('#min-anphabet1').val();
                                break;
                            case 'minimumuppercase':
                                settingValue = $('#min-anphabet2').val();
                                break;
                            case 'minimumnumbers':
                                settingValue = $('#min-number').val();
                                break;
                            case 'minimumsymbols':
                                settingValue = $('#min-char').val();
                                break;                            
                            //Sử dụng captcha
                            case 'enablecaptcha':
                                settingValue = $('#cb-captcha').is(':checked') ? 'True' : 'False';
                                break;
                            case 'captchatype':
                                settingValue = $('#cb-captchaApha').is(':checked') ? 'Text' : 'Math';
                                break;
                            case 'captchakeynumbers':
                                settingValue = $('#min-captcha').val();
                                break;
                            default:
                                settingValue = ''; // Giá trị mặc định nếu không khớp với bất kỳ settingKey nào
                        }
                        const setting = {
                            Id: settingId,
                            Key: settingKey,
                            Value: settingValue
                        };

                        $.ajax({
                            url: 'https://localhost:7132/Setting/UpdateSetting',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(setting),
                            success: function (data) {
                                console.log('Thêm dữ liệu thành công:', data);
                            },
                            error: function (xhr, status, error) {
                                console.error('Lỗi khi thêm dữ liệu:', error);
                            }
                        });
                    }
                }
            };
        });
        //Checkbox sử dụng captcha
        function toggleEnabledCaptcha(enabled) {
            if (enabled) {
                $('#cb-captchaApha').closest('.pc-1').show();
                $('#cb-captchaNumber').closest('.pc-1').show();
                if ($('#cb-captchaApha').is(':checked') === true) {
                    $('#min-captcha').closest('.pc-1').show();
                }
                $('#captchaCanvas').closest('.captcha').show();
                $('#user-input').closest('.captcha').show();
            } else {
                $('#cb-captchaApha').closest('.pc-1').hide();
                $('#cb-captchaNumber').closest('.pc-1').hide();
                $('#min-captcha').closest('.pc-1').hide();
                $('#captchaCanvas').closest('.captcha').hide();
                $('#user-input').closest('.captcha').hide();
            }
        }
        $('#cb-captcha').on('change', function () {
            toggleEnabledCaptcha($(this).is(':checked'));
        });
        //Checkbox kiểu captcha sử dụng chữ và kí tự
        function toggleCaptchaType(enabled) {
            if (enabled) {
                $('#min-captcha').closest('.pc-1').show();
            } else {
                $('#min-captcha').closest('.pc-1').hide();
            }
        }

        $('#cb-captchaApha').on('change', function () {
            toggleCaptchaType($(this).is(':checked'));
            if ($(this).is(':checked') === true) {
                $('#cb-captchaNumber').prop('checked', false);
            }
        });
        $('#cb-captchaNumber').on('change', function () {
            if ($(this).is(':checked') === true) {
                toggleCaptchaType(false);
                $('#cb-captchaApha').prop('checked', false);
            }
        });
    }
}
$(document).ready(function () {
    const myComponent = new MyComponent();
    myComponent.init();
});