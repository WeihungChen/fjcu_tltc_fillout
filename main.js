import { fetchPost } from "./common/web.js";
import { serverUrl } from "./common/def_global.js";

Init();
document.getElementById('btn_submit').addEventListener('click', SubmitData);

async function Init()
{
    const content = {
        "method": "initform"
    };
    var result = await fetchPost(serverUrl + '/api', content, "application/json");
    if(result[0] == 200)
    {
        const cityObj = document.getElementById('city');
        for(var i=0; i<result[1].Cities.length; i++)
        {
            var opt = document.createElement('option');
            opt.id = result[1].Cities[i].Name;
            opt.innerHTML = result[1].Cities[i].Name;
            cityObj.appendChild(opt);
        }
    }
}

async function SubmitData()
{
    event.preventDefault(); //prevent reloading html

    var content = {
        "method": "submitdata",
        "data": {
            "Name": document.getElementById('name').value,
            "Term": document.getElementById('term').value,
            "City": document.getElementById('city').value,
            "Organization": document.getElementById('organization').value,
            "Unit": document.getElementById('unit').value,
            "Title": document.getElementById('title').value,
            "Email": document.getElementById('email').value
        }
    }
    if(content.data.Name == '' || content.data.Term == '' || content.data.City == ''
    || content.data.Organization == '' || content.data.Unit == '' || content.data.Title == ''
    || content.data.Email == '')
    {
        alert('請填寫完整資料');
        return;
    }
    if(content.data.Email.indexOf('@') == -1)
    {
        alert('請輸入完整Email');
        return;
    }

    var result = await fetchPost(serverUrl + '/api', content, "application/json");
    console.log(result);
    if(result[0] == 200) // Submit successfully
        document.location.href="./done.html";
    else
        alert(result[2]);
}