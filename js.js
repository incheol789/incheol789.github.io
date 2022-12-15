class User {
    constructor(nname, root, email, address, datetime = Date.now()) {
        this.nname = nname;
        this.root = root;
        this.email = email;
        this.address = address;
        this.datetime = datetime;
    }
};

const createAccount = () => {
    const nname = document.getElementById("nname");
    const pwd = document.getElementById("password");
    const email = document.getElementById("email");
    const address = document.getElementById("address");

    //1.아이디검사
    //첫글자는 반드시 영소문자로 이루어지고,
    //아이디의 길이는 4~12글자사이
    //숫자가 하나이상 포함되어야함.
    const regExp1 = /^[a-z][a-z\d]{3,11}$/;
    const regExp2 = /[0-9]/;
    if(!regExpTest(regExp1
                    ,nname
                    ,"아이디는 영소문자로 시작하는 4~12글자입니다."))
        return false; // submit핸들러 기본 작동(submit)을 방지
    if(!regExpTest(regExp2
                    ,nname
                    ,"아이디는 숫자를 하나이상 포함하세요."))
        return false;

    //2.비밀번호 확인 검사
    //숫자/문자/특수문자/ 포함 형태의 8~15자리 이내의 암호 정규식
    //전체길이검사 /^.{8,15}$/
    //숫자하나 반드시 포함 /\d/
    //영문자 반드시 포함 /[a-zA-Z]/
    //특수문자 반드시 포함  /[\\*!&]/

    const regExpArr = [/^.{8,15}$/, /\d/, /[a-zA-Z]/, /[\\*!&]/];

    for (let i = 0; i < regExpArr.length; i++) {
        if (
        !regExpTest(
            regExpArr[i],
            pwd,
            "비밀번호는 8~15자리 숫자/문자/특수문자를 포함해야합니다."
        )
        ) {
        return false;
        }
    }

    //5.이메일 검사
    // 4글자 이상(\w = [a-zA-Z0-9_], [\w-\.]) @가 나오고
    // 1글자 이상(주소). 글자 가 1~3번 반복됨
    if (
        !regExpTest(
        /^[\w]{4,}@[\w]+(\.[\w]+){1,3}$/,
        email,
        "이메일 형식에 어긋납니다."
        )
    )
        return false;

    createUser();
    alert("회원가입 제출 완료!");
    return true;
};


function regExpTest(regExp, el, msg) {
    if (regExp.test(el.value)) return true;
    //적합한 문자열이 아닌 경우
    alert(msg);
    el.value = "";
    el.focus();
    return false;
}

/**
 * 폼제출 - localStorage에 저장
 */
const createUser = () => {
    // 1. 객체 생성
    const user = new User(nname.value, root.value, address.value, email.value);
    console.log(user);

    // 2. 배열에 추가
    const userList = JSON.parse(localStorage.getItem('userList')) || [];
    userList.push(user);
    console.log(userList);

    // 3. localStorage에 저장
    localStorage.setItem('userList', JSON.stringify(userList));

    // 4. 초기화
    document.createAccountFrm.reset();
};

const renderUserList = (userList = JSON.parse(localStorage.getItem('userList'))) => {
    const tbody = document.querySelector("#tbl-userList tbody");

    if (userList) {
        userList.forEach(({nname, root, email, address, datetime}, index) => {
            tbody.innerHTML += `
            <tr>
                <td>${index+1}</td>
                <td>${nname}</td>
                <td>${root}</td>
                <td>${email}</td>
                <td>${address}</td>
                <td>${datetimeFormatter(new Date(datetime))}</td>
            </tr>
            `;
        });
    }
    else {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">등록된 회원이 없습니다.</td></tr>`;
    }
};

const datetimeFormatter = (date) => {
    const f = (n) => n >= 10 ? n : "0" + n;
    const MM = f(date.getMonth() + 1);
    const dd = f(date.getDate());
    const HH = f(date.getHours());
    const mm = f(date.getMinutes());
    return `${MM}/${dd} ${HH}:${mm}`;

};

const popupList = () => {
    const w = 700, h = 550;
    const {width, height, availWidth, availHeight, availTop} = screen;
    const left = (width-w)/2;
    const top = (height-h)/2;
    const popup = open('userList.html', 'User List', `width=${w}px, height=${h}px, left=${left}px, top=${top}px`);
};