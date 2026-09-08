---
layout: default
---

{% for post in paginator.posts %}
<article>
    <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
    <p>{{ post.content }}</p>
    
    {% if post.more and post.more != "" %}
    <details class="more-section">
        <summary>:more</summary>
        <div class="more-content">
            {{ post.more | markdownify }}
        </div>
    </details>
    {% endif %}

    <time><span>{{ post.date | date: "%Y.%m.%d" }}</span></time>
</article>
{% endfor %}

<div class="menu">
    <ul>
        {% if paginator.previous_page %}
            <li><a href="{{ paginator.previous_page_path | relative_url }}">PREV</a></li>
        {% else %}
            <li>PREV</li>
        {% endif %}
        
        <li>| <a href="{{ '/' | relative_url }}">INDEX</a> |</li>

        {% if paginator.next_page %}
            <li><a href="{{ paginator.next_page_path | relative_url }}">NEXT</a></li>
        {% else %}
            <li>NEXT</li>
        {% endif %}
    </ul>
</div>
